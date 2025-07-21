const cron = require('node-cron');
const { fetchAndQueueJobs } = require('../services/jobFetcher');

cron.schedule('0 * * * *', async () => {
  console.log('Running job fetch task...');
  const total = await fetchAndQueueJobs();
});