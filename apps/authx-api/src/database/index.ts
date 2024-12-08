import { POSTGRES_URI, NODE_ENV } from "../config";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sessions } from "./models/session-model";
import { users } from "./models/user-model";

const postgresClient = new Client({
  connectionString: POSTGRES_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(postgresClient, {
  schema: {
    ...sessions,
    ...users,
  },
  logger: NODE_ENV == "development",
});

async function connect() {
  await postgresClient.connect();
  console.info("====== Connected to Postgres ======");
  return postgresClient;
}

export default connect;
