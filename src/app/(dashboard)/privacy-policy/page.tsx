import { PublicProse } from "@/components/PubilcProse";

export const metadata = {
  title: "Privacy Policy",
};

const Page = async () => {
  return <PublicProse fileName="privacyPolicy" />;
};

export default Page;
