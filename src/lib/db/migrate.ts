import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// Load environment variables
loadEnvConfig(process.cwd());

const runMigrations = async () => {
  const connection = postgres(process.env.DATABASE_URL ?? "", { max: 1 });
  const db = drizzle(connection);

  console.log("Running migrations...");

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }

  await connection.end();
  process.exit(0);
};

runMigrations();
