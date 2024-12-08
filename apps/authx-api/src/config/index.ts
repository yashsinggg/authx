import { z } from 'zod';

const envVariableSchema = z.object({
  NODE_ENV: z.string().default('development'),
  BUN_PORT: z.string().default('8080'),
  BUN_HOST: z.string().default(''),
  BUN_PREFIX: z.string().default(''),
  ACCESS_TOKEN_SECRET: z.string({ required_error: 'Access_TOKEN_SECRET is required' }),
  REFRESH_TOKEN_SECRET: z.string({ required_error: 'REFRESH_TOKEN_SECRET is required' }),
  POSTGRES_URI: z.string({ required_error: 'POSTGRES_URI is required' }),
});

export const {
  BUN_PORT,
  NODE_ENV,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  POSTGRES_URI,
} = envVariableSchema.parse(Bun.env);
