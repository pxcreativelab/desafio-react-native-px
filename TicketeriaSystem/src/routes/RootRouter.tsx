import AppHeader from '@/components/AppHeader';

import { navigationRef } from '@/helpers/NavigationService';
import React from 'react';
import { AuthRoutes } from './Auth.routes';
import { TicketeriaRoutes } from './Ticketeria.routes';

interface RootRouterProps {
  isAuthenticated: boolean;
}

export const RootRouter: React.FC<RootRouterProps> = ({ isAuthenticated }) => {
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

