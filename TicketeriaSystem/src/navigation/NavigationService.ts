import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: string, params?: Record<string, any>) {
  if (navigationRef.isReady()) {
    // cast to any to avoid narrow generic typing issues in various RN versions
    (navigationRef.navigate as any)(name, params);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    (navigationRef.goBack as any)();
  }
}

export function getCurrentRoute(): { name?: string; params?: any } | undefined {
  if (!navigationRef.isReady()) return undefined;
  const route = navigationRef.getCurrentRoute();
  if (!route) return undefined;
  return { name: route.name, params: route.params };
}

export default {
  navigationRef,
  navigate,
  goBack,
  getCurrentRoute,
};
