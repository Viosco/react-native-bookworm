import cron from 'cron';
import https from 'https';

const job = new cron.CronJob("*/14 * * * *", function() {
    https.get(process.env.API_URL, (res) => {
        if (res.statusCode === 200) {
            console.log("Get request successful");
        } else {
            console.log("Get request failed", res.statusCode);
        }
    })
    .on("error", (err) => {
        console.error("Error making GET request:", err);
    })
})

export default job;

//* 14 * * * * - Every 14 minutes
//* 0 0 * * * - Every day at midnight
//* 0 0 * * 0 - Every Sunday at midnight
//* 30 3 15 * * - Every 15th of the month at 3:30 AM
//* 0 0 1 1 * - Every 1st of January at midnight
//* 0 * * * * - Every hour at the start of the hour