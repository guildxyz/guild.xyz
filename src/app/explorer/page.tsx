import { GuildCard } from "./components/GuildCard";

const Explorer = () => {
  return (
    <main className="container mx-auto grid max-w-screen-lg gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
      <GuildCard />
    </main>
  );
};

export default Explorer;
