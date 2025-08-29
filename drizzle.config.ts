import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
  migrations: {
    table: "drizzle_migrations",
    schema: "public",
  },
});
