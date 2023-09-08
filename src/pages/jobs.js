import { useEffect, useState } from 'react';
import RootLayout from '@/components/Layout';
import JobCard from '@/components/JobCard';

import { LoaderIcon, SearchIcon } from '@/components/Icons';

export default function Jobs() {
  const [isLoading, setIsLoading] = useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    setIsLoading(true);
    return async () => {
      const response = await fetch(
        'https://codev-job-board-app.azurewebsites.net/api/Job/getall'
      );
      const jobsJson = await response.json();
      setJobPostings(jobsJson);
      setIsLoading(false);
    };
  }, []);

  const submitHandler = async event => {
    event.preventDefault();
    setIsLoading(true);
    const response = await fetch(
      `https://codev-job-board-app.azurewebsites.net/api/Job/filter?keyword=${keyword}`
    );
    const jobsJson = await response.json();

    setJobPostings(jobsJson);
    setIsLoading(false);
  };

  return (
    <RootLayout>
      <h2>Jobs Index</h2>

      <form
        onSubmit={submitHandler}
        className='mb-4 mt-6 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]'
      >
        <label
          htmlFor='default-search'
          className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
        >
          Search
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <SearchIcon />
          </div>
          <input
            type='search'
            id='default-search'
            className='block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Search Job Openings...'
            onChange={e => setKeyword(e.currentTarget.value)}
          />
          <button
            type='submit'
            className='text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          >
            Search
          </button>
        </div>
      </form>
      {isLoading && (
        <>
          <LoaderIcon width='24' height='24' className='spin' />
          <p align='center' className='mt-2'>
            Fetching jobs data...
          </p>
        </>
      )}
      {!isLoading && jobPostings.length === 0 && <p>No job postings yet.</p>}
      {!isLoading && jobPostings.length > 0 && (
        <ul className='d-flex mt-3 p-4 bg-gray-100 divide-y divide-gray-200 dark:divide-gray-700 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]'>
          {jobPostings.map(
            ({ title: jobTitle, description, noOfOpenings, id: jobId }) => {
              return (
                <JobCard
                  key={jobId}
                  jobId={jobId}
                  title={jobTitle}
                  description={description}
                  slots={noOfOpenings}
                  applying={true}
                />
              );
            }
          )}
        </ul>
      )}
    </RootLayout>
  );
}
