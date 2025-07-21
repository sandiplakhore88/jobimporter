const { Queue } = require('bullmq');
const { getRedis } = require('./redis');

let jobQueue;

const initQueue =()=> {
  const connection = getRedis();
  jobQueue = new Queue('job-import-queue', { connection });
}

const getJobQueue =() =>{
  return jobQueue;
}

module.exports = { initQueue, getJobQueue };