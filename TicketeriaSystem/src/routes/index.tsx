import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import TicketeriaList from '../pages/Ticketeria';
import CreateTicket from '../pages/Ticketeria/CreateTicket';
import TicketDetails from '../pages/Ticketeria/TicketDetails';

export type RootStackParamList = {
  Ticketeria: undefined;
  CreateTicket: undefined;
  TicketDetails: { ticketId: string | number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppRoutes: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
        initialRouteName="Ticketeria"
      >
        <Stack.Screen
          name="Ticketeria"
          component={TicketeriaList}
          options={{ title: 'Tickets' }}
        />
        <Stack.Screen
          name="CreateTicket"
          component={CreateTicket}
          options={{
            title: 'Novo Ticket',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="TicketDetails"
          component={TicketDetails}
          options={{ title: 'Detalhes do Ticket' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppRoutes;
