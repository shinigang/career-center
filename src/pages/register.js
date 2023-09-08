import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import RootLayout from '@/components/Layout';
import Registration from '@/components/Registration';

export default function Register() {
  const router = useRouter();
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  if (isAuth) {
    router.push('/applications');
  }
  return <RootLayout>{!isAuth && <Registration />}</RootLayout>;
}
