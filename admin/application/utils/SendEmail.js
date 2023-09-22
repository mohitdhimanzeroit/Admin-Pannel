// const nodemailer = require("nodemailer");

// const sendEmail = async (email, subject, text) => {
//     try {
//         const transporter = nodemailer.createTransport({
//              service: 'gmail',
//             host: 'smtp.gmail.com',
//             port: 465,
//             secure: true,
//             auth: {
//               user: "mohitdhiman.zeroit@gmail.com",
//               pass: "ptqc vgnm lskb lgaq" 
//             }
//         });

//         await transporter.sendMail({
//             from: "mohitdhiman.zeroit@gmail.com",
//             to: email,
//             subject: subject,
//             text: text,
//         });

//         console.log("email sent sucessfully");
//     } catch (error) {
//         console.log(error, "email not sent");
//     }
// };

// module.exports = sendEmail;