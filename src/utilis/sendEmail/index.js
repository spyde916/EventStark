import { OtpForHtml } from "@/constants/actions";
import nodemailer from "nodemailer";
// console.log(process.env.EMAIL_USER, "email user");

export const sendOtpEmail = async (email,otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOption = {
      from: `Starks world <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP for email varification",
      html: OtpForHtml(otp),
    };

    const result = await transporter.sendMail(mailOption);
    if(result){
        console.log("otp email sent ")
        return result;
    }
  } catch (err) {
    console.log("error in sendEmail", err);
  }
};
