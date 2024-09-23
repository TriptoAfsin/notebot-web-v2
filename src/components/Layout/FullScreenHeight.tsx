import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
function FullScreenHeight({ children }: Props) {
  return <div className="min-h-screen">{children}</div>;
}

export default FullScreenHeight;
