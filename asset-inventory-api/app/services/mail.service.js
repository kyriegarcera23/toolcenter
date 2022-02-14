const nodemailer = require("nodemailer");
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

/*****
https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4MXzCYWo347dDA9U9JdDqeKyXnBaRRE60jLSU1jqh09ScWO1q4tdvTnqzZsmDq-ItubJ53Cp3rMcIzq8_hrEGtsBXuw8Q
****/

module.exports = async (to_address = '', email_subject = '', email_text = '', html_file = '', html_data = {}, email_attach = []) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transporter.use('compile', inlineBase64());

  html_data.app = `https://${process.env.SERVER_NAME}`;
  html_data.year = new Date().getFullYear();

  const filePath = await path.join(__dirname, `../views/templates/emails/${html_file}.html`);
  const source = await fs.readFileSync(filePath, 'utf-8').toString();
  const template = await handlebars.compile(source);
  const replacements = html_data;
  const htmlToSend = template(replacements);
  
  let info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`, // sender address
    to: `${to_address}`, // list of receivers (separated with comma)// test kyrie
    cc: 'micts-systems@trends.com.ph;jdmalibiran@trends.com.ph;kagarcera@trends.com.ph',//test kyrie
    subject: `${email_subject}`, // Subject line
    text: `${email_text}`, // plain text body
    html: `${htmlToSend}`, // html body
    attachments: email_attach //array attachement
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>  
};

//old emailer

// let info = await transporter.sendMail({
//   from: `${process.env.EMAIL_USER}`, // sender address
//   to: `${to_address}`, // list of receivers (separated with comma)
//   subject: `${email_subject}`, // Subject line
//   text: `${email_text}`, // plain text body
//   html: `${htmlToSend}`, // html body
//   attachments: email_attach //array attachement
// });
