import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function PUT(request , {params}) {
  const data = await request.json();
  const {id} = params
  const connection = await ConnectDb();


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

  const session = await getServerSession(authOptions);
  const userId = session.user.userId;

 

//   console.log("id of updateEvent", id);

  try {
    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 401 }
      );
    }
    

    const sql = `UPDATE events
    set event_name= ? , description = ? , event_date = ? , start_time = ? , end_time = ? ,
     location =? , cover_image=? , start_visibility_date=? , start_visibility_time = ? , end_visibility_date=?,
     end_visibility_time=?, donations_qr_code=? , host_name = ? , status = ?
     WHERE 
     id=? AND user_id = ?
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
      status ,
      id,
      userId
    ];

    const [result] = await connection.execute(sql, values);
    console.log(result, "this the result of the updateEvent");

    return NextResponse.json(
      { message: "EventData updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error of updateEvent", error);
    return NextResponse.json({ message: "Did not update" }, { status: 500 });
  }finally{
    await connection.end()
  }
}
