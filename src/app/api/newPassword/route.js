import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST (request){
    const data = await request.json()
    const {newPassword , userId} = data
    const connection = await ConnectDb()

    try {
        
        const hashedPassword = await bcrypt.hash(newPassword , 10)

        const sql = `update users 
                     set password = ?
                     where user_id  = ?`
        const [result] = await connection.execute(sql , [hashedPassword , userId])

        return NextResponse.json({message : "Password updated successfully"} , {status : 200})
        
    } catch (error) {
        console.log(error , "error from newPassword")
        return NextResponse.json({message : "Password did not update"} , {status : 500})
    }finally{
        await connection.end()
    }
}