const express = require("express");
const { getAllJobs } = require("../controllers/jobController");
const { authUser, authRole } = require("../middlewares/roleBaseAuth");

const jobRoute = express.Router();

jobRoute.get("/getAllJobs", authUser, authRole('Admin'), getAllJobs); //get all jobs

module.exports = { jobRoute };
