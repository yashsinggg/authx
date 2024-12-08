import Elysia from 'elysia';
import { Logestic } from 'logestic';
import { NODE_ENV, BUN_PORT } from './config';
import { AuthenticationError } from './exceptions/AuthenticationError';
import { AuthorizationError } from './exceptions/AuthorizationError';
import { InvariantError } from './exceptions/InvariantError';
import connect from './database';
import router from './routes';

async function startServer() {
  try {
    await connect();
    console.info(`=================================`);
    console.info(`======= ENV: ${NODE_ENV} =======`);
    console.info(`=================================`);
    console.info(`🚀 App listening on the port ${BUN_PORT}`);

    const app = new Elysia({
      prefix: Bun.env.BUN_PREFIX || '',
      serve: {
        hostname: Bun.env.BUN_HOST || '',
      },
    })
      .error('AUTHENTICATION_ERROR', AuthenticationError)
      .error('AUTHORIZATION_ERROR', AuthorizationError)
      .error('INVARIANT_ERROR', InvariantError)
      .onError(({ code, error, set }) => {
        switch (code) {
          case 'AUTHENTICATION_ERROR':
            set.status = 401;
            return {
              status: 'error',
              message: error.toString(),
            };
          case 'AUTHORIZATION_ERROR':
            set.status = 403;
            return {
              status: 'error',
              message: error.toString(),
            };
          case 'INVARIANT_ERROR':
            set.status = 400;
            return {
              status: 'error',
              message: error.toString(),
            };
          case 'NOT_FOUND':
            set.status = 404;
            return {
              status: 'error',
              message: error.toString(),
            };
          case 'INTERNAL_SERVER_ERROR':
            set.status = 500;
            return {
              status: 'error',
              message: 'Something went wrong!',
            };
        }
      })
      //see this if you want to configure logger https://github.com/cybercoder-naj/logestic/wiki/
      .use(Logestic.preset('fancy'))
      .use(router)
      .listen(Bun.env.BUN_PORT || 8080);

    console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
}

startServer();
