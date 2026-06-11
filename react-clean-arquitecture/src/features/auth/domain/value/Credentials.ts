export interface Credentials {
  username: string;
  password: string;
}

export type AuthStatus = "idle" | "authenticated" | "unauthenticated";
