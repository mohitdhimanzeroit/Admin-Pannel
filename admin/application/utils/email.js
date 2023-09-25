const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "mohitdhiman.zeroit@gmail.com",
            pass: "ptqc vgnm lskb lgaq"
        }
    });

    const mailOptions = {
        from: "mohitdhiman.zeroit@gmail.com",
        to: option.email,
        subject: option.subject,
        text: option.message,
        //html:
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
