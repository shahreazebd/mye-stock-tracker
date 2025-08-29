import { drizzle } from "drizzle-orm/postgres-js";
import { reset } from "drizzle-seed";
import * as schema from "./schema";

async function main() {
  try {
    const db = drizzle(process.env.DATABASE_URL || "");
    await reset(db, schema);
    console.log("Database reset successful");
  } catch (error) {
    console.error("Error resetting database:", error);
  }
}

main();
