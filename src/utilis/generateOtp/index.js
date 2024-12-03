import { emailVerificationWithOtp } from "@/services/apiServices";
import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";

const otpStorage = {};
let userId;



const generateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
    return otp;
}

const setOTPExpiration = (otp,userId) => {
    setTimeout(async () => {
        delete otpStorage[otp];
    },10 * 60 * 1000); // 10 minutes in milliseconds
}

export const  generateFourDigitOtp = async (id) => {
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000)
    const connection = await ConnectDb()
    const userId = id;
    const otp = generateOtp();
    try {

        const sql = `UPDATE users SET otp = ?, otp_expiration = ? WHERE user_id = ?`
        const [storeOtp] = await connection.execute(sql ,[otp , expirationTime , userId])

        return otp;
    } catch (error) {
        return NextResponse.json({message : "otp did not store"} , {status : 500})
    }finally{
        await connection.end()
    }
    
}

export const verifyOtp = async(otp,userId) => {
    console.log("otpStorage", otpStorage);
    console.log(userId , "userId in utils")
    if(otpStorage[otp]){
        delete otpStorage[otp];
        await emailVerificationWithOtp(userId)
        return true;
    } else{
        return false;
    }
}


