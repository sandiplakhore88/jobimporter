const { Worker } = require("bullmq");
const { getRedis } = require("../config/redis");
const { connectDB } = require("../config/db");
const { JobModel } = require("../models/jobModel");
const { LogModel } = require("../models/logModel");
const { sanitizeKeys } = require("../utils/keySanitizer");
const crypto = require("crypto"); // For fallback jobId generation

let totalImported = 0;
let newJobs = 0;
let updatedJobs = 0;
let failedJobs = [];

(async () => {
  await connectDB();

  const worker = new Worker(
    "job-import-queue",
    async (job) => {
      try {
        const jobData = sanitizeKeys(job.data);

        let jobId = null;

        if (typeof jobData.guid === "string") {
          jobId = jobData.guid;
        } else if (
          typeof jobData.guid === "object" &&
          typeof jobData.guid._ === "string"
        ) {
          jobId = jobData.guid._;
        } else if (typeof jobData.link === "string") {
          jobId = jobData.link;
        } else if (
          typeof jobData.link === "object" &&
          typeof jobData.link._ === "string"
        ) {
          jobId = jobData.link._;
        }

        if (!jobId || typeof jobId !== "string") {
          const hashInput = `${jobData.title}-${jobData["job:company"] || ""}-${
            jobData.link?._ || ""
          }`;
          jobId = crypto.createHash("md5").update(hashInput).digest("hex");
        }

        const update = {
          jobId,
          title: jobData.title,
          company: jobData["job:company"] || "",
          location: jobData["job:location"] || "",
          category: jobData["job:category"] || "",
          type: jobData["job:type"] || "",
          description: jobData.description || "",
          url: typeof jobData.link === "object" ? jobData.link._ : jobData.link,
          updatedAt: new Date(),
        };

        const result = await JobModel.findOneAndUpdate({ jobId }, update, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        });

        totalImported++;
        if (result.createdAt.getTime() === result.updatedAt.getTime()) {
          newJobs++;
        } else {
          updatedJobs++;
        }
      } catch (error) {
        failedJobs.push({
          jobId: job.data.guid || job.data.link || "unknown",
          reason: error.message,
        });
      }
    },
    {
      connection: getRedis(),
      concurrency: 5,
    }
  );

  worker.on("completed", async () => {
    const newLog = new LogModel({
      totalFetched: totalImported + failedJobs.length,
      totalImported,
      newJobs,
      updatedJobs,
      failedJobs,
    });

    await newLog.save();

    totalImported = 0;
    newJobs = 0;
    updatedJobs = 0;
    failedJobs = [];
  });
})();
