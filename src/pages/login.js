import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import RootLayout from '@/components/Layout';
import Auth from '@/components/Auth';

export default function Login() {
  const router = useRouter();
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  if (isAuth) {
    router.push('/applications');
  }
  return <RootLayout>{!isAuth && <Auth />}</RootLayout>;
}
