import bearer from '@elysiajs/bearer';
import cookie from '@elysiajs/cookie';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';

import { apiMiddleware } from '../middlewares/ApiMiddleware';
import {
  loginHandler,
  signupHandler,
  refreshAccessTokenHandler,
  logoutHandler,
} from '../handler/auth-controller';

const authRouter = new Elysia({ prefix: '/auth' })
  .post('/signup', signupHandler)
  .post('/login', loginHandler)
  .get('/refresh', refreshAccessTokenHandler)
  .post('/logout', logoutHandler);

const router = new Elysia()
  .get('/', () => 'I am Iron Man')
  .get('/health', () => 'Ok')

  .use(
    jwt({
      name: 'jwt',
      secret: Bun.env.JWT_SECRET || 'secret',
      exp: '7d',
    })
  )
  .use(
    jwt({
      name: 'refreshJwt',
      secret: Bun.env.JWT_REFRESH || 'secret',
    })
  )
  .use(cookie())
  .use(cors())
  .use(bearer())
  .use(
    swagger({
      path: '/swagger',
    })
  )
  .use(authRouter)

  .derive(async ({ bearer, jwt }) => {
    let userId = null;
    if (bearer) {
      try {
        const token = await jwt.verify(bearer);
        userId = token.user_id;
      } catch {
        // token invalid, userId stays null
      }
    }
    return {
      userId,
    };
  })

  // Protected route for checking login
  .get(
    '/posts',
    ({ userId }) => {
      return [{ id: 1, title: 'Hello World' }];
    },
    { beforeHandle: apiMiddleware }
  );

export default router;