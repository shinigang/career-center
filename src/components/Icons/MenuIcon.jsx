const MenuIcon = ({ className, ...otherProps }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`fill-current h-3 w-3 ${className ?? ''}`}
      {...otherProps}
    >
      <title>Menu</title>
      <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
    </svg>
  );
};

export default MenuIcon;
