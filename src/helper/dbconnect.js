import { createConnection } from "mysql2/promise";

export const ConnectDb = async ()=>{
    try {
        const connection = createConnection({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE, 
        });
        // setTimeout(async () => {
        //     try {
        //       console.log("===> ending connection");
        //       await connection.end()
        //     } catch (error) {
        //       console.log("er",error.message);
        //     }
        //   }, 4000);

        console.log("DB connected")
        return connection 
        
    } catch (error) {
        console.log("Connection error: ", error);
        throw error; 
    }
}
