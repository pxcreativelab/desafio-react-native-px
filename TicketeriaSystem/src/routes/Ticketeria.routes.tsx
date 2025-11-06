import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from '../pages/Profile';
import TicketeriaList from '../pages/Ticketeria';
import CreateTicket from '../pages/Ticketeria/CreateTicket';
import TicketDetails from '../pages/Ticketeria/TicketDetails';


const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    headerShown: false,
    animation: 'slide_from_right',
  },
  screens: {
    Home: TicketeriaList,
    TicketDetails,
    CreateTicket,
    Profile,
  },
});

// const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// export function TicketeriaRoutes() {
//   return <Navigation />;
// }
export const TicketeriaRoutes = createStaticNavigation(RootStack);
