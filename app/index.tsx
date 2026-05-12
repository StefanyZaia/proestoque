import { Redirect } from 'expo-router';
import { useAuth } from '@/scr/contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />;
}
