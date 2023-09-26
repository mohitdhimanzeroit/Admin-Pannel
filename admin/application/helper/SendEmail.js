const dotenv = require('dotenv');
dotenv.config();
const Nodemailer = require('nodemailer')
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const sendEmail = (email, html, subject) => {
    return new Promise((resolve, reject) => {

        // const mailTransporter = Nodemailer.createTransport({
        //     host: "smtpout.secureserver.net",
        //     secure: true,
        //     secureConnection: false,
        //     tls: {
        //         ciphers: 'SSLv3'
        //     },
        //     requireTLS: true,
        //     port: 465,
        //     debug: true,
        //     auth: {
        //         user: 'mohitdhiman.zeroit@gmail.com',
        //         pass: 'ptqc vgnm lskb lgaq'

        //     }
        // });
        // let mailDetails = {
        //     from: "mohitdhiman.zeroit@gmail.com",
        //     to: email,
        //     subject: subject,
        //     html: html,
        // };
        const mailTransporter = Nodemailer.createTransport({
            service: 'gmail',
            auth: {
        user: "mohitdhiman.zeroit@gmail.com",
         pass: "ptqc vgnm lskb lgaq" 
            }
          });
    
          const mailDetails = {
            from: 'mohitdhiman.zeroit@gmail.com',
            to: email,
            subject: subject,
            html: html
          };
    
        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                reject("Error Occurs", err)
                // console.log("Error Occurs", err);
            } else {
                resolve("Email sent successfully")
                // console.log("Email sent successfully");
            }
        });
    })
}

module.exports = {
    sendEmail
}