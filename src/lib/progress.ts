import { MODULE_ROUTES } from "@/data/routes";

export const getRouteProgress = (pathname: string) => {
  const route = MODULE_ROUTES.find((item) => item.path === pathname);
  return route?.progress ?? 0;
};

export const getNextRoute = (pathname: string) => {
  const index = MODULE_ROUTES.findIndex((item) => item.path === pathname);
  return index >= 0 && index < MODULE_ROUTES.length - 1
    ? MODULE_ROUTES[index + 1]
    : undefined;
};

export const getPreviousRoute = (pathname: string) => {
  const index = MODULE_ROUTES.findIndex((item) => item.path === pathname);
  return index > 0 ? MODULE_ROUTES[index - 1] : undefined;
};
