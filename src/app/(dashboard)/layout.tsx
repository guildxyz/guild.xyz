import { Header } from "@/components/Header";
import type { PropsWithChildren } from "react";

const Dashboard = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Dashboard;
