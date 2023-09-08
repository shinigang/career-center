import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { authActions } from '@/store/auth-slice';
import RootLayout from '@/components/Layout';
import JobCard from '@/components/JobCard';
import { LoaderIcon } from '../components/Icons';

export default function Applications() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.currentUser);
  const [jobApplications, setJobApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    return async () => {
      const response = await fetch(
        `https://codev-job-board-app.azurewebsites.net/api/JobApplicant/getjobsapplied/${currentUser.userId}`
      );
      const applications = await response.json();
      setJobApplications(applications);
      dispatch(authActions.replaceAppliedJobs(applications));
      setIsLoading(false);
    };
  }, []);

  return (
    <RootLayout>
      <h2>Application History</h2>
      {isLoading && (
        <>
          <LoaderIcon width='24' height='24' className='spin' />
          <p align='center' className='mt-2'>
            Fetching data...
          </p>
        </>
      )}
      {!isLoading && jobApplications.length === 0 && (
        <p>No job applications yet.</p>
      )}
      {!isLoading && jobApplications.length > 0 && (
        <ul className='d-flex mt-3 p-4 bg-gray-100 divide-y divide-gray-200 dark:divide-gray-700 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]'>
          {jobApplications.map(
            ({ title: jobTitle, description, noOfOpenings, id: jobId }) => {
              return (
                <JobCard
                  key={jobId}
                  jobId={jobId}
                  title={jobTitle}
                  description={description}
                  slots={noOfOpenings}
                  applying={false}
                />
              );
            }
          )}
        </ul>
      )}
    </RootLayout>
  );
}
