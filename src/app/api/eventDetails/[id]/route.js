import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'

export async function GET(request , {params}) {
  const connection = await ConnectDb();

  const {id} = params


  try {
    

    if (!id) {
      return NextResponse.json(
        { message: "id is required" },
        { status: 401 }
      );
    }

    const sql = `select * from events where id = ? ;`;

    const [result] = await connection.execute(sql, [id]);
    if(result.length == 0){
      return NextResponse.json({message : "Event not found"} , {status : 404})
    }

    return NextResponse.json(
      { data: result, message: "successfully got the event Based on the event id" },
      { status: 200 }
    );
  } catch (error) {
    console.log("eventDetails Api error", error);
    return NextResponse.json(
      { message: "Did not get the event" },
      { status: 500 }
    );
  }finally{
    await connection.end()
   }
}
