import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";

export async function GET(request)  {
  const connection = await ConnectDb();
  const date = new Date();
  const currentDate = date.toISOString().split("T")[0];

  const { searchParams } = request.nextUrl;
  const searchTerm = searchParams.get("searchTerm");

  //   console.log(currentDate , "from the searchbar")

  try {
    if (searchTerm) {
      const sql = `select * from events where event_date > ? AND (
                 event_name Like ?
                 or location Like ?)`;

      const searchPattern = `%${searchTerm}%`;

      const [result] = await connection.execute(sql, [
        currentDate,
        searchPattern,
        searchPattern,
      ]);

      return NextResponse.json(
        { data: result, message: "successfully got the search result" },
        { status: 200 }
      );
    } else {
      const sql = `SELECT * FROM events WHERE event_date > ? ORDER BY event_date ASC limit 6`;
      const [result] = await connection.execute(sql, [currentDate]);

      return NextResponse.json(
        { data: result, message: "upcoming events got successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error, "error from the searchBar");
    return NextResponse.json(
      { message: "did not get the search Result" },
      { status: 500 }
    );
  }
}
