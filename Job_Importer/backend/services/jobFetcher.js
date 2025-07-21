const axios = require('axios'); 
const { parseXML } = require('../utils/xmlParser');
const { getJobQueue } = require('../config/bull');

const jobFeedUrls = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  // 'https://www.higheredjobs.com/rss/articleFeed.cfm', 
];

const fetchAndQueueJobs = async () => {
  const jobQueue = getJobQueue();
  let totalFetched = 0;

  for (const url of jobFeedUrls) {
    try {
      const { data: xml } = await axios.get(url);

      let parsed;
      try {
        //parse xml to json
        parsed = await parseXML(xml);
      } catch (parseErr) {
        continue; 
      }

      const jobs = parsed?.rss?.channel?.item || [];

      for (const job of jobs) {
        totalFetched++;
        await jobQueue.add('import-job', job);
      }

    } catch (error) {
    }
  }

  return totalFetched;
};

module.exports = { fetchAndQueueJobs };
