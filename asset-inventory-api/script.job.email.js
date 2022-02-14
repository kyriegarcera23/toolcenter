require('dotenv').config();
const cron = require('node-cron');
const moment = require('moment');
const db = require("./app/models");
const { EmailQueue } = db;
const Op = db.Sequelize.Op;
const nodemail = require("./app/services/mail.service");
const errorHandler = require("./app/services/error_handler.service");
const schedule = '*/2 * * * * *'; //every 2 seconds

try {
    cron.schedule(schedule, () => {
        console.log(`start cron @ ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        sendEmail();
    }, {
        scheduled: true,
        timezone: "Asia/Manila"
    });
} catch (err) {
    errorHandler(err, {reference: 'Inside Cron Schedule function'});
}


async function sendEmail() {
    try {
        EmailQueue.findOne(
            {
                where: {status: 1}
            }
        )
        .then(result => {
            nodemail(
                result.email_recipients,
                result.email_subject,
                result.email_text,
                result.email_html,
                JSON.parse(result.email_data)
            );
    
            EmailQueue.update({status:0},{
                where: {
                    id: result.id
                }
            })
            .catch(err => {
                return err || 'Something went wrong';
            });
        })
        .catch(err => {
            return err || 'Something went wrong';
        });
    } catch (err) {
        errorHandler(err, {reference: 'Inside sendEmail function'});
    }
}