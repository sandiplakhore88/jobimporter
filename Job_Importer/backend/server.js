const dotenv = require('dotenv');
dotenv.config();

const {app} = require('./app');
const {connectDB} = require('./config/db');
const { initRedis } = require('./config/redis');
const { initQueue } = require('./config/bull');


connectDB();

initRedis();
initQueue();

 // Start background worker
require('./workers/jobProcessor');
// Start scheduled job fetcher
require('./cron/fetchJobsCron');   


// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});