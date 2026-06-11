import { env } from "../../environments/env.config";
import { tokenStorage } from "../lib/tokenStorage";

/**
 * Cliente HTTP transversal sobre `fetch`.
 *
 * Responsabilidades:
 *  - Prefijar `API_URL` y serializar JSON.
 *  - Inyectar `Authorization: Bearer <accessToken>`.
 *  - Ante un 401, intentar UN refresh (`POST /auth/refresh`) y reintentar la
 *    petición original. Si el refresh falla, limpia los tokens y propaga el error.
 *
 * No hace navegación/redirecciones: de eso se encarga React (los guards de ruta
 * reaccionan al estado de sesión). Aquí solo vive la lógica de red.
 *
 * Para cambiar a `axios` solo habría que reescribir este archivo; el resto de la
 * app consume `httpClient` y no sabe qué hay debajo.
 */

export class ApiError extends Error {
  readonly status: number;
  readonly data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  skipAuthRefresh?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${env.API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
    });
    if (!res.ok) {
      tokenStorage.clear();
      return false;
    }
    const data = (await res.json()) as {
      accessToken: string;
      refreshToken: string;
    };
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    tokenStorage.clear();
    return false;
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, skipAuthRefresh, headers, ...rest } = options;

  const buildHeaders = (): HeadersInit => {
    const result: Record<string, string> = {
      "Content-Type": "application/json",
      ...(headers as Record<string, string>),
    };
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) result.Authorization = `Bearer ${accessToken}`;
    return result;
  };

  const doFetch = () =>
    fetch(`${env.API_URL}${path}`, {
      ...rest,
      headers: buildHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res = await doFetch();

  // 401 -> intentar refresh una sola vez y reintentar.
  if (res.status === 401 && !skipAuthRefresh) {
    refreshPromise ??= refreshTokens();
    const refreshed = await refreshPromise;
    refreshPromise = null;
    if (refreshed) {
      res = await doFetch();
    }
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      (isJson && (data as { message?: string })?.message) ||
      `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, data);
  }

  return data as T;
}

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
} as const;
