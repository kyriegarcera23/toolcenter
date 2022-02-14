require('dotenv').config();
const cron = require('node-cron');
const moment = require('moment');
const db = require("./app/models");
const { Asset,AssetWarranty,AssetSoftware,Client,Recipient,EmailQueue } = db;
const Op = db.Sequelize.Op;
const errorHandler = require("./app/services/error_handler.service");
const timeout = 1000; // 1s
const schedule = '00 00 * * *'; // 12:00am

try {
    cron.schedule(schedule, () => {
        console.log(`start cron @ ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        assetWarrantyChecker();
        assetSoftwareWarrantyChecker();
    }, {
        scheduled: true,
        timezone: "Asia/Manila"
    });
} catch (err) {
    errorHandler(err, {reference: 'Inside Cron Schedule function'});
}

async function assetWarrantyChecker()
{
    try {
        const assets = await Asset.findAll(
            {
                where: {
                    status: 2
                },
                include: [
                    {
                        model:AssetWarranty
                    },
                    {
                        model:Client,
                        include: [{model:Recipient}]
                    }
                ]
            }
        )
        .then(result => {
            return result
        })
        .catch(err => {
            return err || 'Something went wrong';
        });

        const new_assets = assets.filter((asset) => {
            // only send email when warranty is only have 90,60,30,10 days below
            if(asset.AssetWarranty)
            {
                return dateToDays(asset.AssetWarranty.amc_warranty) <= 90 && asset.AssetWarranty.warranty_type != 'Perpetual'
            }
        });
        // end
    
        new_assets.map((new_asset) => {
            setTimeout(async ()=>{
                let days = `${dateToDays(new_asset.AssetWarranty.amc_warranty)} day(s)`;
                let subject = `[MICTS][${new_asset.Client.name}][Alert][${changePriority(days)}]:${capitalize(new_asset.asset_type)} Warranty Expiry - ${capitalize(new_asset.hostname)} - ${days}`
                let recipients = await getRecipients(new_asset.Client.Recipients);
                let details = dateToDays(new_asset.AssetWarranty.amc_warranty) < 0 ? `has expired ${dateToDays(new_asset.AssetWarranty.amc_warranty)} days ago.` : `have remaining ${dateToDays(new_asset.AssetWarranty.amc_warranty)} days.`;
                updatePriority(days,new_asset);

                const email_data = { // Send Email email_to_address, email_subject, '', email_html, email_attach
                    recipient_name: '',
                    details: details,
                    priority: changePriority(days),
                    asset_type: capitalize(new_asset.asset_type),
                    hostname: new_asset.hostname,
                    ip_address: new_asset.ip_address,
                    model: new_asset.model ? new_asset.model : 'N/A',
                    manufacturer: new_asset.manufacturer ? new_asset.manufacturer : 'N/A',
                    service_tag: new_asset.service_tag ? new_asset.service_tag : 'N/A',
                    role: new_asset.role ? new_asset.role : 'N/A'
                }
    
                const email_queue = {
                    email_recipients: recipients,
                    email_subject: subject,
                    email_text: '',
                    email_html: 'asset-alert.email',
                    email_data: JSON.stringify(email_data),
                    email_attach: '',
                    status: 1
                };
    
                EmailQueue.create(email_queue)
                .catch(err => {
                    console.log({message: err.message || "Some error occured."});
                });

            },timeout)
        });
    } catch (err) {
        errorHandler(err, {reference: 'Inside assetWarrantyChecker function'});
    }
}

async function assetSoftwareWarrantyChecker()
{
    try {
        const assets = await AssetSoftware.findAll(
            {
                where: {status: 2},
                include: [
                    {
                        model:Client,
                        include: [{model:Recipient}]
                    }
                ]
            }
        )
        .then(result => {
            return result
        })
        .catch(err => {
            return err || 'Something went wrong';
        });
    
        const new_assets = assets.filter((asset) => {
            // only send email when warranty is only have 90,60,30,10 days below
            return dateToDays(asset.warranty_date) <= 90 && (asset.warranty_type != 'Perpetual')
        });
        // end
    
        new_assets.map((new_asset) => {
            setTimeout(async ()=>{
                let days = `${dateToDays(new_asset.warranty_date)} day(s)`;
                let subject = `[MICTS][${new_asset.Client.name}][Alert][${changePriority(days)}]:Software Warranty Expiry - ${capitalize(new_asset.name)} - ${days}`
                let recipients = await getRecipients(new_asset.Client.Recipients);
                let details = dateToDays(new_asset.warranty_date) < 0 ? `has expired ${dateToDays(new_asset.warranty_date)} days ago.` : `have remaining ${dateToDays(new_asset.warranty_date)} days.`;
                updatePriority(days,new_asset);

                const email_data = { // Send Email email_to_address, email_subject, '', email_html, email_attach
                    recipient_name: '',
                    details: details,
                    priority: changePriority(days),
                    asset_type: 'Software',
                    name: new_asset.name,
                    description: new_asset.description,
                    warranty_date: new_asset.warranty_date
                }
                
                const email_queue = {
                    email_recipients: recipients + `comg-rm@trends.com.ph`,
                    email_subject: subject,
                    email_text: '',
                    email_html: 'asset-software-alert.email',
                    email_data: JSON.stringify(email_data),
                    email_attach: '',
                    status: 1
                };
    
                EmailQueue.create(email_queue)
                .catch(err => {
                    console.log({message: err.message || "Some error occured."});
                });
            },timeout)
        });
    } catch (err) {
        errorHandler(err, {reference: 'Inside assetSoftwareWarrantyChecker function'});
    }
}

function dateToDays(warranty_date)
{
    //verify first invalid date time
    warranty_date = warranty_date != '' && warranty_date != 'N/A'
    && warranty_date != null ? moment(warranty_date).utc().utcOffset(-8).format('YYYY-MM-DD') : '';

    try {
        // To set two dates to two variables
        var date1 = new Date(warranty_date);
        var date2 = new Date();

        // To calculate the time difference of two dates
        var Difference_In_Time = date2.getTime() - date1.getTime();

        // To calculate the no. of days between two dates
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        return Difference_In_Days < 0 ? parseInt(Difference_In_Days * -1) : parseInt(Difference_In_Days);
    } catch (err) {
        errorHandler(err, {reference: 'Inside dateToDays function'});
    }
}

function capitalize(s) {
    try {
        return typeof s !== 'string' ? '' : s.charAt(0).toUpperCase() + s.slice(1)
    } catch (err) {
        errorHandler(err, {reference: 'Inside capitalize function'});
    }
}

async function getRecipients(recipients) {
    try {
        let email_recipients = ``;

        await recipients.map((recipient) => {
            email_recipients += `${recipient.email},`;
        });
        
        return email_recipients.slice(0, -1);
    } catch (err) {
        errorHandler(err, {reference: 'Inside getRecipients function'});
    }
    
}

function changePriority(days) {
    days = days.replace(/day\(s\)/g, '');
    if (parseInt(days) >= 90)
    {
        return 'Valid';
    }
    else if (parseInt(days) >= 60)
    {
        return 'Low';
    }
    else if (parseInt(days) >= 30)
    {
        return 'Medium';
    }
    else
    {
        return 'High';
    }
}

function updatePriority(days,obj) {
    if(obj.asset_type)
    {
        Asset.update({priority: changePriority(days)}, {where: {id: obj.id}})
        .catch(err => {
            errorHandler(err, {reference: 'Inside updatePriority function'});
        })
    }
    else
    {
        AssetSoftware.update({priority: changePriority(days)}, {where: {id: obj.id}})
        .catch(err => {
            errorHandler(err, {reference: 'Inside updatePriority function'});
        })
    }
}