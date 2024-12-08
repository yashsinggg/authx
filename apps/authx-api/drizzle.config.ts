import type { Config } from 'drizzle-kit';

export default {
    schema: [
      "./src/database/models/session-model.ts",
      "./src/database/models/user-model.ts",
    ],
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.DATABASE_URL ?? "postgres://myuser:mypassword@localhost:5432/mydb",
    },
  } satisfies Config;
