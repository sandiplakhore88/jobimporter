const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const JobSchema = new mongoose.Schema(
  {
    jobUuid: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },

    jobId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
    },

    company: {
      type: String,
    },

    location: {
      type: String,
    },

    category: {
      type: String,
    },

    type: {
      type: String,
    },

    description: {
      type: String,
    },

    url: {
      type: String,
    },
  },
  { timestamps: true }
);

const JobModel = mongoose.model("jobs", JobSchema);
module.exports = { JobModel };
