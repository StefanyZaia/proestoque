import { Redirect } from 'expo-router';
import { isLoggedIn } from '@/lib/session';

export default function Index() {
  return <Redirect href={isLoggedIn() ? '/(tabs)' : '/login'} />;
}
