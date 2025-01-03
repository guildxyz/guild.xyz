import type { PropsWithChildren, ReactElement } from "react";

export const DataBlock = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <span className="h-6 break-words rounded-md bg-blackAlpha px-1.5 py-0.5 font-mono text-sm dark:bg-blackAlpha-hard">
      {children}
    </span>
  );
};
