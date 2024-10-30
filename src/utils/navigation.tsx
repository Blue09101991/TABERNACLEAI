import { useRouter } from 'next/router';
import { IRoute } from '@/types/navigation';
import useRoutes from '@/routes';

// NextJS Requirement
export const isWindowAvailable = () => typeof window !== 'undefined';

export const useCurrentRoute = () => {
  const router = useRouter();
  const dynamicRoutes = useRoutes();

  for (let route of dynamicRoutes) {
    if (route.items) {
      const found = findCurrentRoute(route.items, router.pathname);
      if (found) return found;
    }
    if (router.pathname?.match(route.path) && route) {
      return route;
    }
  }
};

export const useActiveRoute = () => {
  const route = useCurrentRoute();
  return route?.name || 'All Templates';
};

export const useActiveNavbar = () => {
  const route = useCurrentRoute();
  return route?.secondary || false;
};

export const useActiveNavbarText = () => {
  return useActiveRoute() || false;
};

// Helper function
const findCurrentRoute = (
  routes: IRoute[],
  pathname: string,
): IRoute | undefined => {
  for (let route of routes) {
    if (route.items) {
      const found = findCurrentRoute(route.items, pathname);
      if (found) return found;
    }
    if (pathname?.match(route.path) && route) {
      return route;
    }
  }
};

export const getActiveRoute = (routes: IRoute[], pathname: string): string => {
  const route = findCurrentRoute(routes, pathname);
  return route?.name || 'TABERNACLE AI';
};

export const getActiveNavbar = (
  routes: IRoute[],
  pathname: string
): boolean => {
  const route = findCurrentRoute(routes, pathname);
  if (route?.secondary) return route?.secondary;
  else return false;
};
