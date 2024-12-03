import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'

export async function GET() {
  const connection = await ConnectDb();

  try {

    const sql = `select * from events where status = 'published' ORDER BY RAND() limit 6 `
    
    const [result] = await connection.execute(sql)
    return NextResponse.json(
      { data : result ,  message: "Successfully got the FeaturedEvents events" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "did not get the FeaturedEvents events" },
      { status: 500 }
    );
  } finally{
    await connection.end()
   }
}
