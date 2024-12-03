import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";

export async function POST(request) {

  const data = await request.json();
  const { fullName, email, phoneNumber , id } = data;
  const connection = await ConnectDb();

  try {
    

    const sql = `insert into events_registration(full_name , email , phone , event_id)values(? , ? , ? , ? )`;

    const values = [fullName, email, phoneNumber , id];

    const [result] = await connection.execute(sql, values);

    return NextResponse.json({ message: "Event registration successful" } , {status : 200});
  } catch (error) {
    console.log(error, "error from the eventRegistration");
    return NextResponse.json({ message: "Event registration unsuccessful " } ,{status : 500});
  } finally{
    await connection.end()
  }
}
