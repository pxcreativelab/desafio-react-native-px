import Login from '@pages/Auth/Login';
import Register from '@pages/Auth/Register';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AuthStack = createNativeStackNavigator({
  initialRouteName: 'Login',
  screenOptions: {
    headerShown: false,
    animation: 'slide_from_right',
  },
  screens: {
    Login,
    Register: {
      screen: Register,
      options: {
        headerShown: true,
        headerTitle: '',
        headerBackTitle: 'Voltar',
        headerTransparent: true,
      },
    },
  },
});

// const Navigation = createStaticNavigation(AuthStack);

export type AuthStackParamList = StaticParamList<typeof AuthStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AuthStackParamList {}
  }
}

// export function AuthRoutes() {
//   return <Navigation />;
// }

export const AuthRoutes = createStaticNavigation(AuthStack);
