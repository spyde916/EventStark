import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";
import { generateFourDigitOtp } from "@/utilis/generateOtp";
import { sendOtpEmail } from "@/utilis/sendEmail";

export async function POST(request){
    const data = await request.json()
    const {email} = data ;
    const connection = await ConnectDb()

    // console.log(email , "email from forgetpassword")


    try {
        const sql = `select user_id from users where email = ?`
        const [result] = await connection.execute(sql , [email])
        console.log(result , "result from forgetpassword")

        if(result.length == 0){
            return NextResponse.json({message : "invalid email , please enter valid email"} , {status  : 400})
        }
        const userId = result[0].user_id
        const otp = await generateFourDigitOtp(userId)


        if(otp){
            await sendOtpEmail(email , otp)
        }

        return NextResponse.json({userId : userId , message : " otp successfully sent to your email account to change your password "} , {status : 200})

    } catch (error) {
        
        return NextResponse.json({message : "otp did not send to your email for new password"} , {status : 500})
    }finally{
        await connection.end()
    }

}