import type { Metadata } from "next";

type Props = {
  params: Promise<{ guild: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const urlName = (await params).guild;

  return {
    title: urlName,
  };
}

const GuildPage = async ({ params }: Props) => {
  const urlName = (await params).guild;

  return (
    <div className="grid gap-4">
      <p>Guild page</p>
      <p>{`URL name: ${urlName}`}</p>
    </div>
  );
};

export default GuildPage;
