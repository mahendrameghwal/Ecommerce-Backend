import { sendEmail } from "../services/email.service";

export const sendOTP = async (to: string, otp: string) => {
    const subject = 'Your Verification OTP';
    const text = `Your verification code is ${otp}. It is valid for 10 minutes.`;
    await sendEmail(to, subject, text);
};
