import { ConnectDb } from "@/helper/dbconnect";
import { generateFourDigitOtp } from "@/utilis/generateOtp";
import { sendOtpEmail } from "@/utilis/sendEmail";
import { NextResponse } from "next/server";

export async function POST(request){

    const connection = await ConnectDb()
    const {id} = await request.json()
    
    const userId = id 
    
    try {
        const sql = `select email from users where user_id = ?`
        const [result] = await connection.execute(sql , [userId])

        
        const email = result[0].email 

        const otp = await generateFourDigitOtp(userId) 

        if(otp){
            await sendOtpEmail(email , otp)
        }
        return NextResponse.json({message : "otp sent successfully"} , {status : 200})

    } catch (error) {
        console.log(error , "error from resendOtp")
        return NextResponse.json({message : "otp did not send"} , {status : 500})
    }

}