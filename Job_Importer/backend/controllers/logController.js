const {LogModel} = require('../models/logModel');

const getLogs = async (req, res) => {
  try {
    let {page=1,limit=10} = req.query;
    page =parseInt(page,10);
    limit = parseInt(limit,10);

    //find log records
    const logs = await LogModel.find().sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit);

    if(!logs || logs?.length === 0){
      return res.status(404).json({message:"No record found.",success:false});
    }
    
    //count total records
    const total = await LogModel.countDocuments();

    return res.status(200).json({message:'Successfully get logs.',success:true, data:logs, pagination:{
      currentPage:page,
      totalPages:Math.ceil(total/limit),
      totalRecords:total,
    }})
  } catch (error) {
    return res.status(500).json({ message:error.message, success:false });
  }
};

module.exports = {getLogs};