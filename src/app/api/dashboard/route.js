import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
export const dynamic = 'force-dynamic'

export async function GET() {
  const connection = await ConnectDb();
  const session = await getServerSession(authOptions);

  try {
    const userId = session.user.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 401 }
      );
    }

    const sqlEvent = `select * from events e where user_id = ? order by e.created_at desc`;

    const [eventDetail] = await connection.execute(sqlEvent, [userId]);

    // console.log(eventDetail , "eventDetails from dashborad")

    const sqlUser = 'select full_name , email from users where user_id = ?'
    const [userDetail] = await connection.execute(sqlUser , [userId])

    const result = {eventDetail , userDetail}

    // console.log(result , "result from the dashboard")

    return NextResponse.json(
      { data: result, message: "successfully got the events of user" },
      { status: 200 }
    );
  } catch (error) {
    console.log("dashboardApi error", error);
    return NextResponse.json(
      { message: "Did not get the User events" },
      { status: 500 }
    );
  }finally{
   await connection.end()
  }
}

