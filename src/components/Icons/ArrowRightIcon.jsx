const ArrowRightIcon = ({ className, ...otherProps }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 14 10'
      width='24'
      height='24'
      fill='currentColor'
      stroke='currentColor'
      strokeWidth='0'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`arrow-right-icon ${className ?? ''}`}
      {...otherProps}
    >
      <path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M1 5h12m0 0L9 1m4 4L9 9'
      />
    </svg>
  );
};

export default ArrowRightIcon;
