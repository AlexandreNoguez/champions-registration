import { timingSafeEqual } from 'crypto';
import { getServerEnv } from '@/lib/env';

type AdminAuthResult =
  | {
      isAuthorized: true;
      message: string;
      status: 200;
    }
  | {
      isAuthorized: false;
      message: string;
      status: 401 | 503;
    };

export function validateAdminRequest(request: Request): AdminAuthResult {
  const { ADMIN_TOKEN } = getServerEnv();

  if (!ADMIN_TOKEN) {
    return {
      isAuthorized: false,
      message: 'Token administrativo não configurado.',
      status: 503,
    };
  }

  const token = getRequestAdminToken(request);

  if (!token || !areTokensEqual(token, ADMIN_TOKEN)) {
    return {
      isAuthorized: false,
      message: 'Acesso administrativo não autorizado.',
      status: 401,
    };
  }

  return {
    isAuthorized: true,
    message: 'Acesso autorizado.',
    status: 200,
  };
}

function getRequestAdminToken(request: Request) {
  const authorization = request.headers.get('authorization');

  if (authorization?.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '').trim();
  }

  return request.headers.get('x-admin-token')?.trim();
}

function areTokensEqual(receivedToken: string, expectedToken: string) {
  const receivedBuffer = Buffer.from(receivedToken);
  const expectedBuffer = Buffer.from(expectedToken);

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(receivedBuffer, expectedBuffer);
}
