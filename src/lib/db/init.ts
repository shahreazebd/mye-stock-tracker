import { sql } from "drizzle-orm";
import { db } from "./index";

export async function initializeDatabase() {
  try {
    // Test connection
    await db.execute(sql`SELECT 1`);
    console.log("Database connection successful");

    // You can add any initialization logic here
    // For example, creating extensions or initial data

    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    return false;
  }
}
