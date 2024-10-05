const ButtonMenu = ({ className, children, ...props }:any) => {
    return (
      <button
        {...props}
        className={`${className} text-paragraf md:px-[45px] py-[9px] border border-black/40 rounded-md shadow`}>
        {children}
      </button>
    );
  };
  
  export default ButtonMenu;