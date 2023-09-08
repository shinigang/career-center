import { useSelector } from 'react-redux';

import RootLayout from '@/components/Layout';

export default function Profile() {
  const currentUser = useSelector(state => state.auth.currentUser);

  return (
    <RootLayout>
      {currentUser && (
        <>
          <h2>{currentUser.fullName}'s Profile</h2>
          <small>
            <a href={`mailto:${currentUser.emailAddress}`} target='_blank'>
              {currentUser.emailAddress}
            </a>
          </small>
        </>
      )}
    </RootLayout>
  );
}
