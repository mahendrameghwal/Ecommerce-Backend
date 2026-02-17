import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE, // or another service
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            text
        });
        console.log('Email sent to:', to);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendOTP = async (to: string, otp: string) => {
    const subject = 'Your Verification OTP';
    const text = `Your verification code is ${otp}. It is valid for 10 minutes.`;
    await sendEmail(to, subject, text);
};
