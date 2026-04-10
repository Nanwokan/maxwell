const DEFAULT_API_URL = 'http://localhost:4000';
const ADMIN_API_PREFIX = '/api/admin';

function normalizeBaseUrl(rawUrl: string): string {
  return rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  payload?: unknown;
  token?: string;
  headers?: HeadersInit;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL ?? DEFAULT_API_URL);
let persistedAuthToken: string | null = null;

export function setApiAuthToken(token: string | null | undefined): void {
  const normalizedToken = typeof token === 'string' ? token.trim() : '';
  persistedAuthToken = normalizedToken.length > 0 ? normalizedToken : null;
}

async function requestJson<TResponse>(
  path: string,
  { method = 'GET', payload, token, headers }: RequestOptions = {}
): Promise<TResponse> {
  const requestHeaders = new Headers(headers);
  const normalizedToken = typeof token === 'string' ? token.trim() : '';
  const authToken = normalizedToken.length > 0 ? normalizedToken : persistedAuthToken;

  if (payload !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (authToken && !requestHeaders.has('Authorization')) {
    requestHeaders.set('Authorization', `Bearer ${authToken}`);
  }

  const includeCredentials =
    path.startsWith(ADMIN_API_PREFIX) && (!authToken || path === '/api/admin/auth/logout');

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: payload === undefined ? undefined : JSON.stringify(payload),
      credentials: includeCredentials ? 'include' : 'omit',
    });
  } catch {
    const currentOrigin =
      typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'unknown';

    throw new Error(
      `Impossible de joindre l'API sur ${API_BASE_URL}. Verifie que le backend tourne et que ${currentOrigin} est autorise par CORS.`
    );
  }

  const data = (await response.json().catch(() => null)) as
    | TResponse
    | { error?: string; message?: string }
    | null;

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
        ? data.error
        : data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
          ? data.message
          : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data as TResponse;
}

export function getJson<TResponse>(
  path: string,
  options?: Omit<RequestOptions, 'method' | 'payload'>
) {
  return requestJson<TResponse>(path, { ...options, method: 'GET' });
}

export function postJson<TResponse>(
  path: string,
  payload: unknown,
  options?: Omit<RequestOptions, 'method' | 'payload'>
) {
  return requestJson<TResponse>(path, { ...options, method: 'POST', payload });
}

export function patchJson<TResponse>(
  path: string,
  payload: unknown,
  options?: Omit<RequestOptions, 'method' | 'payload'>
) {
  return requestJson<TResponse>(path, { ...options, method: 'PATCH', payload });
}

export function deleteJson<TResponse>(
  path: string,
  options?: Omit<RequestOptions, 'method' | 'payload'>
) {
  return requestJson<TResponse>(path, { ...options, method: 'DELETE' });
}
