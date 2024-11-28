import type { PropsWithChildren } from "react";

export const DataBlock = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <span className="break-words rounded-md bg-blackAlpha px-1.5 py-0.5 font-mono text-sm dark:bg-blackAlpha-hard">
      {children}
    </span>
  );
};
