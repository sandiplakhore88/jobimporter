const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const LogSchema = new mongoose.Schema(
  {
    totalFetched: {
      type: Number,
    },

    totalImported: {
      type: Number,
    },

    newJobs: {
      type: Number,
    },

    updatedJobs: {
      type: Number,
    },

    failedJobs: [
      {
        jobUuid: {
          type: String,
        },
        reason: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true } 
);

const LogModel = mongoose.model("logs", LogSchema);

module.exports = {LogModel};
