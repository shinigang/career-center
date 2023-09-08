import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { authActions } from '@/store/auth-slice';
import { LoginIcon, MailIcon } from './Icons';
import classes from './Auth.module.css';

const Auth = () => {
  const dispatch = useDispatch();
  const emailRef = useRef();
  const router = useRouter();
  const [error, setError] = useState(null);

  const loginHandler = async event => {
    event.preventDefault();

    const response = await fetch(
      'https://codev-job-board-app.azurewebsites.net/api/Applicant/getall'
    );
    const applicants = await response.json();

    let accountExist = false;
    let currentUser = null;
    for (const key in applicants) {
      if (applicants[key].emailAddress == emailRef.current.value) {
        accountExist = true;
        currentUser = {
          userId: applicants[key].id,
          fullName: applicants[key].fullName,
          emailAddress: applicants[key].emailAddress,
        };
        break;
      }
    }
    if (accountExist) {
      dispatch(authActions.login(currentUser));
      router.push('/applications');
    } else {
      setError('Email is not yet registered!');
    }
  };

  return (
    <div className={classes.auth}>
      <section>
        <h1 className='text-center text-xl mb-4 font-bold'>LOGIN FORM</h1>
        <form onSubmit={loginHandler}>
          <label
            htmlFor='user-email'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Your Email
          </label>
          <div className='relative mb-6'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none'>
              <MailIcon className='w-4 h-4 text-gray-500 dark:text-gray-400' />
            </div>
            <input
              ref={emailRef}
              type='email'
              id='user-email'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='name@codev.com'
            />
          </div>
          {error && <small className='text-red-600'>{error}</small>}
          <div className={classes.actions}>
            <button
              type='submit'
              className='self-end text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 mr-2 mb-2'
            >
              Submit
              <LoginIcon className='w-5 h-5 ml-2 -mr-1' />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Auth;
