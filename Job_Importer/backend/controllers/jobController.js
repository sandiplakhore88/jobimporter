const { JobModel } = require("../models/jobModel");

//get all jobs details
const getAllJobs = async (req, res) => {
  try {
    let { page=1, limit=10 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    //find records
    const jobs = await JobModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!jobs || jobs?.length === 0) {
      return res
        .status(404)
        .json({ message: "No record found.", success: false });
    }

    //count total records
    const total = await JobModel.countDocuments();

    return res.status(200).json({
      message: "Successfully get jobs details.",
      success: true,
      data: jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = { getAllJobs };
