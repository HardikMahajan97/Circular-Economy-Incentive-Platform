import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true, // true for port 465, false for other ports
    auth: {
        user: "ceip.aha@gmail.com",
        pass: process.env.EMAIL_PASS_SMTP,
    },
});

async function sendEmail(to, subject, text, html){
    const info = await transporter.sendMail({
        from: "ceip.aha@gmail.com", // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    });
}

export default sendEmail;