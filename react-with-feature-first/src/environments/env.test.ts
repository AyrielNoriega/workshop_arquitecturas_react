import type { AppEnv } from "./env.types";

/** Valores para el modo `test` (Vitest / CI). */
export const testEnv: AppEnv = {
  API_URL: "https://dummyjson.com",
};
