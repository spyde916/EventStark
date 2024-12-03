import bcrypt from "bcryptjs";
import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";
import { generateFourDigitOtp } from "@/utilis/generateOtp";
import { sendEmail, sendOtpEmail } from "@/utilis/sendEmail";

export async function POST(req) {
  const data = await req.json();
  const { fullName, phoneNumber, email, password } = data;
  const connection = await ConnectDb();

  try {
    if (email) {
      const sql = `select email from users where email = ?`;
      const [emailExist] = await connection.execute(sql, [email]);
      if (emailExist.length > 0) {
        return NextResponse.json(
          { message: "User already exists with this email" },
          { status: 401 }
        );
      }
    }
    if (phoneNumber) {
        const sql = `select phone from users where phone = ?`;
        const [NumberExist] = await connection.execute(sql, [phoneNumber]);
        if (NumberExist.length > 0) {
          return NextResponse.json(
            { message: "User already exists with this phone number" },
            { status: 401 }
          );
        }
      }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `insert into users (full_name , email , password , phone) values(?,?,?,?)`;
    const values = [fullName, email, hashedPassword, phoneNumber];
    const [result] = await connection.execute(sql, values);
    console.log("result", result);
    const userId = result.insertId;
    const otp = await generateFourDigitOtp(userId);
    console.log("otp from signup", otp);
    if (otp) {
      await sendOtpEmail(email, otp);
    }



    return NextResponse.json(
      { userId : userId ,  message: "registration successful" },
      { status: 200 }
    );
  } catch (error) {
  
    return NextResponse.json(
      { message: "registration failed" },
      { status: 500 }
    );
  }finally{
    await connection.end()
   }
}
