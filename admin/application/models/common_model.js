

const newModelObj = {},
    nodeMailer = require('nodemailer');




/**
* Send email function
* @param     :
* @returns   :
* @developer : 
*/
newModelObj.generalMail = async function (emailData) {

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'mohitdhiman.zeroit@gmail.com',
            pass: '123456789'
        }
    });

    let mailOptions = {
        from: emailData.from, // sender address
        to: emailData.to, // list of receivers
        subject: emailData.subject, // Subject line
        html: emailData.body, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {

        if (error) {
            return false;
        }

        return true;

    });

}

module.exports = newModelObj;