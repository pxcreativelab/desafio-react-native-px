import AppHeader from '@/components/AppHeader';

import { navigationRef } from '@/helpers/NavigationService';
import { initSyncService } from '@/services/SyncService';
import React, { useEffect } from 'react';
import { AuthRoutes } from './Auth.routes';
import { TicketeriaRoutes } from './Ticketeria.routes';

interface RootRouterProps {
  isAuthenticated: boolean;
}

export const RootRouter: React.FC<RootRouterProps> = ({ isAuthenticated }) => {
  useEffect(() => {
    if (isAuthenticated) {
      initSyncService();
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (
      <>
        <AppHeader />
        <TicketeriaRoutes ref={navigationRef} />
      </>
    );
  }

  return <AuthRoutes />;
};

