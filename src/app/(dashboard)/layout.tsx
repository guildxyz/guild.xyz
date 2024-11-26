import { DashboardContainer } from "@/components/DashboardContainer";
import { Header } from "@/components/Header";
import type { PropsWithChildren } from "react";

const Dashboard = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <DashboardContainer>{children}</DashboardContainer>
    </>
  );
};

export default Dashboard;
