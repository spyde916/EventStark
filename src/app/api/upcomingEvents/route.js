import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const connection = await ConnectDb();
  const date = new Date();
  const currentDate = date.toISOString().split("T")[0];
  const currentTime = date.toTimeString().split(" ")[0];

  console.log(currentDate, "this is current date");
  console.log(currentTime, "this is from upcoming");

  try {
    //upcoming event
    const sql1 = `SELECT * 
                  FROM events 
                  WHERE (CONCAT(start_visibility_date, ' ', start_visibility_time) <= '${currentDate} ${currentTime}')
                    AND (CONCAT(end_visibility_date, ' ', end_visibility_time) >= '${currentDate} ${currentTime}')
                    AND status = 'published'
                  ORDER BY event_date, start_time ASC 
                  LIMIT 6;`
    const [result] = await connection.execute(sql1, [
      currentDate,
      currentTime,
      currentDate,
      currentTime,
    ]);

    // event
    const sql2 = `SELECT * 
                  FROM events 
                  WHERE (CONCAT(start_visibility_date, ' ', start_visibility_time) <= '${currentDate} ${currentTime}')
                    AND (CONCAT(end_visibility_date, ' ', end_visibility_time) >= '${currentDate} ${currentTime}')
                    AND status = 'published'
                 ORDER BY RAND() limit 6`;
    const [events] = await connection.execute(sql2, [
      currentDate,
      currentTime,
      currentDate,
      currentTime,
    ]);
    // console.log(result , "this is the upcoming result")

    return NextResponse.json(
      {
        data: result,
        Events: events,
        message: "Successfully got the upcoming events",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "this the error");
    return NextResponse.json(
      { message: "did not get the upcoming events" },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}
