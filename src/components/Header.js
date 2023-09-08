import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';

import {
  HiredIcon,
  LoginIcon,
  LogoutIcon,
  MenuIcon,
  UserFileIcon,
} from './Icons';
import { authActions } from '../store/auth-slice';

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  // const appliedJobsCount = useSelector(state => state.auth.appliedJobs.length);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutHandler = () => {
    dispatch(authActions.logout());
    router.push('/');
  };

  const menuToggleHandler = () => {
    setIsMenuOpen(prevIsMenuOpen => {
      return !prevIsMenuOpen;
    });
  };

  return (
    <header>
      <nav className='flex items-center justify-between flex-wrap bg-teal-500 p-6'>
        <div className='flex items-center flex-shrink-0 text-white mr-6'>
          <Link href='/'>
            <HiredIcon width='24' height='24' />
          </Link>
          <Link href='/'>
            <span className='font-semibold text-xl tracking-tight'>
              Career Center
            </span>
          </Link>
        </div>
        <div className='block lg:hidden'>
          <button
            onClick={menuToggleHandler}
            className='flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white'
          >
            <MenuIcon />
          </button>
        </div>
        <div
          className={`w-full ${
            isMenuOpen ? 'block' : 'hidden'
          } flex-grow lg:flex lg:items-center lg:w-auto`}
        >
          <div className='text-sm lg:flex-grow'>
            <Link
              href='/jobs'
              className={`block mt-4 lg:inline-block lg:mt-0 hover:text-white mr-4 ${
                router.pathname == '/jobs' ? 'text-white' : 'text-teal-200'
              }`}
            >
              Job Search
            </Link>

            {isAuth && (
              <>
                <Link
                  href='/applications'
                  className={`block mt-4 lg:inline-block lg:mt-0 hover:text-white mr-4 ${
                    router.pathname == '/applications'
                      ? 'text-white'
                      : 'text-teal-200'
                  }`}
                >
                  Application History
                </Link>
                <Link
                  href='/profile'
                  className={`block mt-4 lg:inline-block lg:mt-0 hover:text-white mr-4 ${
                    router.pathname == '/profile'
                      ? 'text-white'
                      : 'text-teal-200'
                  }`}
                >
                  My Profile
                </Link>
              </>
            )}
          </div>
          <div>
            {isAuth && (
              <>
                <Link
                  href='/catalog'
                  className={`block mt-4 lg:inline-block lg:mt-0 hover:text-white mr-4 ${
                    router.pathname == '/catalog'
                      ? 'text-white'
                      : 'text-teal-200'
                  }`}
                >
                  Jobs Catalog
                </Link>
                <button
                  onClick={logoutHandler}
                  className='inline-flex items-center text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0'
                >
                  Logout
                  <LogoutIcon className='w-5 h-5 ml-2 -mr-1' />
                </button>
              </>
            )}
            {!isAuth && (
              <>
                <Link
                  href='/register'
                  className={`inline-flex mr-2 items-center text-sm px-4 py-2 leading-none border rounded border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0 ${
                    router.pathname == '/register'
                      ? 'border-transparent text-teal-500 bg-white'
                      : 'text-white'
                  }`}
                >
                  Register
                  <UserFileIcon className='w-5 h-5 ml-2 -mr-1' />
                </Link>
                <Link
                  href='/login'
                  className={`inline-flex items-center text-sm px-4 py-2 leading-none border rounded border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0 ${
                    router.pathname == '/login'
                      ? 'border-transparent text-teal-500 bg-white'
                      : 'text-white'
                  }`}
                >
                  Login
                  <LoginIcon className='w-5 h-5 ml-2 -mr-1' />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
