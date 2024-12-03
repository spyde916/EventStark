import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";

export async function PUT(request) {
    const data = await request.json()
    const {id , status} = data
    const connection = await ConnectDb()

    try {
        const sql = `update events 
                     set status = ? 
                     where id = ?  `
        const [result] = await connection.execute(sql , [status , id])

        return NextResponse.json({message : "event status has changed"},{status : 200})
        
    } catch (error) {
        console.log(error , "error from statusUpdate")
        return NextResponse.json({message : "Event status did not change"} , {status : 500})
    }finally {
        await connection.end(); 
    }


}