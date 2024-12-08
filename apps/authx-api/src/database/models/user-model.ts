import { pgTable, uuid, varchar, index, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email').notNull().unique(),
  passwordhash: text('passwordhash').notNull(),
}, (table) => {
  return {
    emailIdx: index('email_idx').on(table.email),
  };
});