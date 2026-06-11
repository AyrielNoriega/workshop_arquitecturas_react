import type { AppEnv } from "./env.types";
import { devEnv } from "./env.dev";
import { testEnv } from "./env.test";

const prodEnv: AppEnv = {
  API_URL: import.meta.env.VITE_API_URL ?? "https://dummyjson.com",
};

const envByMode: Record<string, AppEnv> = {
  development: devEnv,
  test: testEnv,
  production: prodEnv,
};

/** Config activa para el modo actual. */
export const env: AppEnv = envByMode[import.meta.env.MODE] ?? prodEnv;

export type { AppEnv };
