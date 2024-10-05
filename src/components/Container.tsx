import { FC, ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

const Container: FC<ContainerProps> = ({ children }) => {
  return (
    <div className="w-full mx-auto container lg:px-10 md:px-5 sm:px-1 px-3">
      {children}
    </div>
  );
};

export default Container;
