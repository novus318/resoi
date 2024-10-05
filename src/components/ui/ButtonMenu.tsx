import { ButtonHTMLAttributes, FC, ReactNode } from "react";

interface ButtonMenuProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
}

const ButtonMenu: FC<ButtonMenuProps> = ({ className = "", children, ...props }) => {
  return (
    <button
      {...props}
      className={`${className} text-paragraf md:px-[45px] py-[9px] border border-black/40 rounded-md shadow`}
    >
      {children}
    </button>
  );
};

export default ButtonMenu;
