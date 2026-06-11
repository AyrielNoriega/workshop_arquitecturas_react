const ROOTS = {
  ROOT: "/auth",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
};

export const paths = {
  ROOT: "/",
  LOGIN: ROOTS.LOGIN,
  DASHBOARD: ROOTS.DASHBOARD,
} as const;
