import { ConnectDb } from "@/helper/dbconnect";
import { NextResponse } from "next/server";


export async function DELETE(request , {params}) {
    const connection = await ConnectDb();


    const {id} = params

    console.log(id, "id of deleteEvent");

    try {
        if (!id) {
            return NextResponse.json(
              { message: "id is required" },
              { status: 401 }
            );
          }
          
        const sql = `DELETE FROM events WHERE id = ?;`;
        const [result] = await connection.execute(sql, [id]);

        return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error, " error of deleteEvent");
        return NextResponse.json({ message: "Event not deleted" }, { status: 500 });
    }
}
