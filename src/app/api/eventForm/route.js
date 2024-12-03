import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req) {
  const connection = await ConnectDb();
  const data = await req.json();
  console.log("data in post",data);
  const {
    eventName,
    description,
    eventDate,
    startTime,
    endTime,
    location,
    coverImage,
    visibleStartDate,
    visibleStartTime,
    visibleEndDate,
    visibleEndTime,
    qrCode,
    hostName ,
    status
  } = data;

  const session = await getServerSession(authOptions)

  // console.log(session , "this is a session data of the user")

  try {
    
    const userId = session.user.userId
    console.log(userId , "userId in  event form")

        if(!userId){
          return NextResponse.json({message : "userId is required"} , {status : 401})
      }

    
    const sql = `
        insert into events (event_name , description , event_date , start_time , end_time , location ,
        cover_image , start_visibility_date , start_visibility_time , end_visibility_date , end_visibility_time , 
        donations_qr_code , host_name ,status ,user_id ) values(? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ,? , ? , ? ,?)
        `;

    const values = [
      eventName,
      description,
      eventDate,
      startTime,
      endTime,
      location,
      coverImage,
      visibleStartDate,
      visibleStartTime,
      visibleEndDate,
      visibleEndTime,
      qrCode ,
      hostName ,
      status,
      userId
    ];
    const [result] = await connection.execute(sql, values);
    console.log("result" , result);

    return NextResponse.json(
      { id : result.insertId ,message: "Event registration successful" },
      { status: 200 }
    );
  } catch (error) {
   console.log(error , "error from event")
    return NextResponse.json(
      { message: "Event registration unsuccessful" },
      { status: 500 }
    );
  }finally{
    await connection.end()
   }
}
