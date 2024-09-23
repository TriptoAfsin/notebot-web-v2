import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};
function CenterWrapper({ children, className = "" }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

export default CenterWrapper;
