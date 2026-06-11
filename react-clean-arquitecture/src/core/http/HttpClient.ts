/**
 * Cliente HTTP genérico sobre `fetch` (detalle de INFRAESTRUCTURA transversal).
 *
 * Responsabilidades:
 *  - Prefijar `baseUrl` y serializar/parsear JSON.
 *  - Inyectar `Authorization: Bearer <token>` si hay un proveedor de token.
 *  - Ante un 401, invocar UNA vez el callback `onUnauthorized` (típicamente un
 *    refresh) y, si tiene éxito, reintentar la petición original.
 *
 * Es deliberadamente AGNÓSTICO de la autenticación: NO conoce `/auth/refresh` ni
 * ningún endpoint de auth. Cómo obtener el token y cómo refrescar se le INYECTAN
 * por configuración desde `core/di`. Así el cliente es reutilizable y la lógica
 * de auth no se filtra a esta capa. Cambiar a axios = reescribir solo este archivo.
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

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Si es true, NO se intenta el refresh-on-401 (p. ej. login/refresh). */
  skipAuthRefresh?: boolean;
}

export interface HttpClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null;
  onUnauthorized?: () => Promise<boolean>;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly getAccessToken?: () => string | null;
  private readonly onUnauthorized?: () => Promise<boolean>;

  private refreshPromise: Promise<boolean> | null = null;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.getAccessToken = config.getAccessToken;
    this.onUnauthorized = config.onUnauthorized;
  }

  private buildHeaders(headers?: HeadersInit): HeadersInit {
    const result: Record<string, string> = {
      "Content-Type": "application/json",
      ...(headers as Record<string, string>),
    };
    const token = this.getAccessToken?.();
    if (token) result.Authorization = `Bearer ${token}`;
    return result;
  }

  private async request<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { body, skipAuthRefresh, headers, ...rest } = options;

    const doFetch = () =>
      fetch(`${this.baseUrl}${path}`, {
        ...rest,
        headers: this.buildHeaders(headers),
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

    let res = await doFetch();

    if (res.status === 401 && !skipAuthRefresh && this.onUnauthorized) {
      this.refreshPromise ??= this.onUnauthorized();
      const refreshed = await this.refreshPromise;
      this.refreshPromise = null;
      if (refreshed) res = await doFetch();
    }

    const isJson = res.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message =
        (isJson && (data as { message?: string })?.message) ||
        `Request failed with status ${res.status}`;
      throw new ApiError(res.status, message, data);
    }

    return data as T;
  }

  get<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: "GET" });
  }
  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: "POST", body });
  }
  put<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: "PUT", body });
  }
  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: "PATCH", body });
  }
  delete<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}
