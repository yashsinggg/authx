import { index, uuid } from 'drizzle-orm/pg-core';
import { pgTableCreator } from 'drizzle-orm/pg-core';
import { users } from './user-model';

const pgTable = pgTableCreator((name) => `c_${name}`);
export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id)
      .unique()
      .notNull(),
    tokenversion: uuid('token_version').defaultRandom().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('user_id_idx').on(table.userId),
    };
  }
);
