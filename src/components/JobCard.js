import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  ArrowRightIcon,
  EditIcon,
  FeatherXIcon,
  LoaderIcon,
} from '@/components/Icons';

const JobCard = ({
  jobId,
  title,
  description,
  slots,
  applying = false,
  manage = false,
  onEdit,
  onDeleted,
}) => {
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const currentUser = useSelector(state => state.auth.currentUser);
  const appliedJobs = useSelector(state => state.auth.appliedJobs);

  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(
    appliedJobs.findIndex(job => job.id === jobId) > -1
  );

  const [isDeleting, setIsDeleting] = useState(false);

  const applyJobHandler = async jobId => {
    setIsApplying(true);
    const response = await fetch(
      `https://codev-job-board-app.azurewebsites.net/api/JobApplicant/applyjob/${jobId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentUser.userId,
          fullName: currentUser.fullName,
          emailAddress: currentUser.emailAddress,
        }),
      }
    );
    setIsApplying(false);
    if (response.ok) {
      setHasApplied(true);
    }
  };

  const editJobHandler = jobId => {
    onEdit(jobId);
  };

  const deleteJobHandler = async jobId => {
    setIsDeleting(true);
    const response = await fetch(
      `https://codev-job-board-app.azurewebsites.net/api/Job/delete`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: jobId,
        }),
      }
    );
    setIsDeleting(false);
    if (response.ok) {
      onDeleted(jobId);
    }
  };

  return (
    <li key={jobId} className='py-3 sm:py-4'>
      <div className='flex items-center space-x-4'>
        <div className='flex-1 min-w-0'>
          <p className='capitalize text-sm font-medium text-gray-900 truncate dark:text-white'>
            {title}
          </p>
          <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
            {description}
          </p>
        </div>
        <div className='inline-flex flex-col items-center text-gray-900 dark:text-white'>
          <span className='font-semibold text-md font-semibold'>{slots}</span>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            Slots
          </span>
        </div>
        {isAuth && applying && (
          <div className='px-3'>
            <button
              onClick={e => applyJobHandler(jobId)}
              type='button'
              disabled={isApplying || hasApplied}
              className={`w-[145px] text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                hasApplied
                  ? 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed'
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              {isApplying && (
                <>
                  <LoaderIcon width='14' height='14' className='spin' />
                  <span>Applying...</span>
                </>
              )}
              {!isApplying && !hasApplied && (
                <>
                  Apply Now!
                  <ArrowRightIcon className='w-3.5 h-3.5 ml-2' />
                </>
              )}
              {hasApplied && <span>Already Applied</span>}
            </button>
          </div>
        )}
        {isAuth && manage && (
          <div className='flex gap-1 px-3'>
            <button
              onClick={e => editJobHandler(jobId)}
              type='button'
              className='flex items-center justify-center w-9 h-9 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg toggle-full-view hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 dark:bg-gray-800 focus:outline-none dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
            >
              <EditIcon width='18' height='18' />
            </button>
            <button
              onClick={e => deleteJobHandler(jobId)}
              type='button'
              disabled={isDeleting}
              className='flex items-center justify-center w-9 h-9 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg toggle-full-view hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 dark:bg-gray-800 focus:outline-none dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
            >
              <FeatherXIcon width='18' height='18' />
            </button>
          </div>
        )}
      </div>
    </li>
  );
};

export default JobCard;
