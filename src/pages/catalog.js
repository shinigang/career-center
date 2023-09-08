import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import RootLayout from '@/components/Layout';
import JobCard from '@/components/JobCard';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { LoaderIcon, SearchIcon } from '@/components/Icons';

export default function Catalog() {
  const jobFormRef = useRef(null);
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [formMode, setFormMode] = useState('Add');

  const [editJobId, setEditJobId] = useState(null);
  const [title, setTitle] = useState('');
  const [slot, setSlot] = useState('1');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('0');

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

  const searchHandler = async event => {
    event.preventDefault();
    setIsLoading(true);
    const response = await fetch(
      `https://codev-job-board-app.azurewebsites.net/api/Job/filter?keyword=${keyword}`
    );
    const jobsJson = await response.json();

    setJobPostings(jobsJson);
    setIsLoading(false);
  };

  const resetJobForm = () => {
    setEditJobId(null);
    setTitle('');
    setDescription('');
    setSlot('1');
    setIndustry('0');
    setFormMode('Add');
  };

  const cancelEditHandler = e => {
    resetJobForm();
  };

  const formSubmitHandler = async event => {
    event.preventDefault();

    if (title.trim() === '') {
      return;
    }
    if (description.trim() === '') {
      return;
    }
    if (slot.trim() === '') {
      return;
    }

    const jobData = {
      title,
      description,
      industry: +industry,
      noOfOpenings: +slot,
    };
    let toastMsg = 'Creating job data...';
    if (formMode === 'Edit') {
      jobData.id = editJobId;
      toastMsg = 'Updating job data...';
    }
    const toastId = toast.loading(toastMsg);

    const response = await fetch(
      `https://codev-job-board-app.azurewebsites.net/api/Job/${
        formMode == 'Add' ? 'insert' : 'update'
      }`,
      {
        method: formMode == 'Add' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      }
    );
    const newJobId = await response.json();

    if (response.ok) {
      if (formMode == 'Add') {
        jobData.id = newJobId;
        setJobPostings(prevJobs => {
          return [...prevJobs, jobData];
        });
        toastMsg = 'Job data was inserted successfully!';
      } else {
        setJobPostings(prevJobs => {
          return prevJobs.map(job => (job.id === editJobId ? jobData : job));
        });
        toastMsg = 'Job data was updated successfully!';
      }
      toast.update(toastId, {
        render: toastMsg,
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      resetJobForm();
    }
  };

  const jobEditHandler = jobId => {
    const jobToEdit = jobPostings.find(job => job.id === jobId);
    console.log(jobToEdit);
    setEditJobId(jobId);
    setTitle(jobToEdit.title);
    setDescription(jobToEdit.description);
    setSlot(jobToEdit.noOfOpenings);
    setIndustry(jobToEdit.industry);
    setFormMode('Edit');

    jobFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const jobsDeletedHandler = jobId => {
    setJobPostings(prevJobs => {
      return prevJobs.filter(job => job.id !== jobId);
    });

    toast.success('Job data was deleted!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  return (
    <RootLayout>
      <ToastContainer />
      <h2>Jobs Catalog</h2>

      <form
        onSubmit={searchHandler}
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
            placeholder='Search Job Catalog...'
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

      {isAuth && (
        <form
          ref={jobFormRef}
          onSubmit={formSubmitHandler}
          className='p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4 mt-3 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]'
        >
          <h2 className='mb-4'>{formMode} Job Form</h2>
          <div className='grid md:grid-cols-2 md:gap-4'>
            <div className='relative z-0 w-full mb-6 group'>
              <input
                type='text'
                name='position_title'
                id='position-title'
                className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                required
                value={title}
                onChange={e => setTitle(e.currentTarget.value)}
              />
              <label
                htmlFor='position-title'
                className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Position Title
              </label>
            </div>
            <div className='relative z-0 w-full mb-6 group'>
              <input
                type='number'
                name='job_slots'
                min='1'
                max='9999'
                id='job-slots'
                className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                required
                value={slot}
                onChange={e => setSlot(e.currentTarget.value)}
              />
              <label
                htmlFor='floating_phone'
                className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Slots
              </label>
            </div>
          </div>
          <div className='grid md:grid-cols-2 md:gap-4'>
            <div className='relative z-0 w-full mb-6 group'>
              <input
                type='text'
                name='job_description'
                id='job-description'
                className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                placeholder=' '
                required
                value={description}
                onChange={e => setDescription(e.currentTarget.value)}
              />
              <label
                htmlFor='job-description'
                className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Description
              </label>
            </div>
            <div className='relative z-0 w-full mb-6 group'>
              <label htmlFor='industry-select' className='sr-only'>
                Industry
              </label>
              <select
                id='industry-select'
                className='block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer'
                value={industry}
                onChange={e => setIndustry(e.currentTarget.value)}
              >
                <option value='0'>Software Development</option>
                <option value='1'>Cloud Computing</option>
                <option value='2'>Cybersecurity</option>
                <option value='3'>Data Analytics and Big Data</option>
                <option value='4'>
                  Artificial Intelligence (AI) and Machine Learning (ML)
                </option>
                <option value='5'>IT Consulting</option>
                <option value='6'>E-commerce and Online Retail</option>
                <option value='7'>Telecommunications</option>
                <option value='8'>Healthcare IT</option>
              </select>
            </div>
          </div>
          <div className='text-right'>
            {formMode === 'Edit' && (
              <button
                type='button'
                onClick={cancelEditHandler}
                className='text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2'
              >
                Cancel Editing
              </button>
            )}
            <button
              type='submit'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
              {formMode == 'Add' ? 'Create Job' : 'Update Job'}
            </button>
          </div>
        </form>
      )}
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
                  applying={false}
                  manage={true}
                  onEdit={jobEditHandler}
                  onDeleted={jobsDeletedHandler}
                />
              );
            }
          )}
        </ul>
      )}
    </RootLayout>
  );
}
