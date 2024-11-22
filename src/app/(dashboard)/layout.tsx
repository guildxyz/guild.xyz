import type { PropsWithChildren } from "react";

const Dashboard = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
  //<Layout>
  //  <LayoutHero className="pb-28">
  //    <Header />
  //    <LayoutHeadline className="max-w-screen-md">
  //      <LayoutTitle className="text-foreground">Privacy Policy</LayoutTitle>
  //    </LayoutHeadline>
  //  </LayoutHero>
  //
  //  <LayoutMain className="prose flex max-w-screen-md flex-col prose-headings:font-display prose-headings:text-foreground prose-li:text-foreground text-foreground marker:text-foreground">
  //    {children}
  //  </LayoutMain>
  //</Layout>
};

export default Dashboard;
