import dotenv from "dotenv";
import MySQL from "./mysql/connection.js";
dotenv.config();

(async () => {
    try {
        console.info("creating pool step");
        await MySQL.createPool(); // creates at this point the pool for all future request
        MySQL.setupDatabase(); //setup default tables and default rows
    } catch (err) {
        console.error("Database connection error:", err);
        // see alternative like some retries not just kill the intire process process because of one fail connection
        //process.exit(1); // Exit if database fails to connect
    }
})();
