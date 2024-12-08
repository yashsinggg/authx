import { error } from 'elysia';
import { StatusCodes } from 'http-status-codes';
import { login, signup as signupService, refreshAccessToken, logout } from '../service/auth-service';

export async function signupHandler({ body, jwt, refreshJwt, set }: any) {
  const { email, password } = body;
  if (!email || !password) {
    throw error(StatusCodes.BAD_REQUEST, 'Email and password are required');
  }
  const { access_token, refresh_token, user } = await signupService(email, password, jwt, refreshJwt);
  set.headers['x-access-token'] = access_token;
  set.headers['x-refresh-token'] = refresh_token;
  return { user };
}

export async function loginHandler({ body, jwt, refreshJwt, set }: any) {
  const { email, password } = body;
  if (!email || !password) {
    throw error(StatusCodes.BAD_REQUEST, 'Email and password are required');
  }
  const { access_token, refresh_token, user } = await login(email, password, jwt, refreshJwt);

  set.headers['x-access-token'] = access_token;
  set.headers['x-refresh-token'] = refresh_token;
  return { user };
}

export async function refreshAccessTokenHandler({ jwt, refreshJwt, headers, set }: any) {
  const refresh_token = headers.authorization?.split(' ')[1];
  if (refresh_token == null) throw error(StatusCodes.BAD_REQUEST, 'Refresh Token not provided');
  const accessToken = await refreshAccessToken(refresh_token, jwt, refreshJwt);
  set.headers['x-access-token'] = accessToken;
  return { status: 'success' };
}

export async function logoutHandler({ jwt, refreshJwt, headers }: any) {
  const refresh_token = headers.authorization?.split(' ')[1];
  if (refresh_token == null) throw error(StatusCodes.BAD_REQUEST, 'Refresh Token not provided');
  await logout(refresh_token, jwt, refreshJwt);
  return { status: 'success' };
}