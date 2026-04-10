import { Suspense, lazy, useEffect, useState } from 'react';

import { isAdminRoute, subscribeToRouteChange } from '@/lib/app-route';

const PublicApp = lazy(() => import('@/App'));
const AdminApp = lazy(() => import('@/admin/AdminApp'));

function AppFallback() {
  return <div className="min-h-screen bg-[#0B0F17]" />;
}

export default function RootRouter() {
  const [adminRoute, setAdminRoute] = useState(() => isAdminRoute());

  useEffect(() => {
    return subscribeToRouteChange(() => {
      setAdminRoute(isAdminRoute());
    });
  }, []);

  return (
    <Suspense fallback={<AppFallback />}>
      {adminRoute ? <AdminApp /> : <PublicApp />}
    </Suspense>
  );
}
