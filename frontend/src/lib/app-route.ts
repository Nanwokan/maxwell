const ADMIN_HASH_ROUTE = '#/admin';
const ROUTE_CHANGE_EVENT = 'maxwell:route-change';

function notifyRouteChange() {
  window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));
}

function buildPath(url: URL) {
  return `${url.pathname}${url.search}${url.hash}`;
}

function normalizePublicPath(pathname: string) {
  const normalizedPath = pathname.replace(/\/admin\/?$/, '/');
  return normalizedPath.length > 0 ? normalizedPath : '/';
}

export function isAdminRoute(
  locationLike: Pick<Location, 'pathname' | 'hash'> = window.location
) {
  return (
    locationLike.pathname.startsWith('/admin') ||
    locationLike.hash.startsWith(ADMIN_HASH_ROUTE)
  );
}

export function subscribeToRouteChange(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  window.addEventListener('popstate', onChange);
  window.addEventListener(ROUTE_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener('hashchange', onChange);
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(ROUTE_CHANGE_EVENT, onChange);
  };
}

export function navigateToAdminRoute() {
  const nextUrl = new URL(window.location.href);
  nextUrl.hash = '/admin';
  window.history.pushState({}, '', buildPath(nextUrl));
  window.scrollTo({ top: 0, behavior: 'auto' });
  notifyRouteChange();
}

export function navigateToPublicRoute() {
  const nextUrl = new URL(window.location.href);
  nextUrl.hash = '';
  nextUrl.pathname = normalizePublicPath(nextUrl.pathname);
  window.history.pushState({}, '', buildPath(nextUrl));
  window.scrollTo({ top: 0, behavior: 'auto' });
  notifyRouteChange();
}
