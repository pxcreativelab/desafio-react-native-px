import AppHeader from '@/components/AppHeader';
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
        <TicketeriaRoutes />
      </>
    );
  }

  return <AuthRoutes />;
};

