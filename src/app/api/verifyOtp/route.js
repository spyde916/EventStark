import { verifyOtp } from "@/utilis/generateOtp";
import { NextResponse } from "next/server";
import { ConnectDb } from "@/helper/dbconnect";

export async function POST(req) {
  const connection = await ConnectDb();
  const data = await req.json();
  const { otp , userId } = data;
  
  const userOtp = otp


  try {
    // const result = await verifyOtp(otp);
    

    const sql = `select otp , otp_expiration from users where user_id = ?`
    const [getOtp] = await connection.execute(sql , [userId])
    

    if (getOtp.length > 0) {
      const { otp , otp_expiration } = getOtp[0];

      // console.log(otp , otp_expiration, "thhis is verify otp" )
      
      if (userOtp === otp && new Date() < otp_expiration) {
        const sqlUpdateVerification = `UPDATE users
                                       SET isEmailVerified = 1, otp = NULL, otp_expiration = NULL
                                       WHERE user_id = ?`;
 
        await connection.execute(sqlUpdateVerification, [userId]);
 
        return NextResponse.json(
          { message: "OTP verification successful" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "OTP invalid or expired" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    

  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }finally{
    await connection.end()
  }
}
