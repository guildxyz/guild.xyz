import { AuthBoundary } from "@/components/AuthBoundary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { env } from "@/lib/env";
import { Plus, SignIn } from "@phosphor-icons/react/dist/ssr";
import { Suspense } from "react";
import { GuildCard } from "./components/GuildCard";
import { InfiniteScrollGuilds } from "./components/InfiniteScrollGuilds";

const _getGuilds = async () => {
  const request = `${env.NEXT_PUBLIC_API}/guild/search?page=1&pageSize=24&sortBy=name&reverse=false&search=`;
  const guilds = (await (
    await fetch(request)
  ).json()) as PaginatedResponse<Guild>;

  return guilds;
};

const getAssociatedGuilds = async () => {
  const request = `${env.NEXT_PUBLIC_API}/guild/search?page=1&pageSize=24&sortBy=name&reverse=false&search=`;
  const guilds = (await (
    await fetch(request)
  ).json()) as PaginatedResponse<Guild>;

  return guilds;
};

const GuildCardSkeleton = () => {
  return (
    <Card>
      <Skeleton className="size-full" />
    </Card>
  );
};

export default function Explorer() {
  //const { items: guilds } = await getGuilds();

  return (
    <main className="container mx-auto grid max-w-screen-lg gap-8 px-4 py-8">
      <section className="pt-6 pb-8">
        <h1 className="font-black text-5xl">Guildhall</h1>
      </section>

      <YourGuildsSection />

      <section className="">
        <Input placeholder="Search guild.xyz" />
      </section>

      <InfiniteScrollGuilds />
      {/*<section className="grid gap-2">
        <h2 className="font-bold text-lg">Explore guilds</h2>
        {guilds.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guilds.map((guild) => (
              <GuildCard key={guild.id} guild={guild} />
            ))}
          </div>
        ) : (
          <p>Couldn&apos;t fetch guilds</p>
        )}
      </section>*/}
    </main>
  );
}

async function YourGuildsSection() {
  return (
    <section className="grid gap-2">
      <h2 className="font-bold text-lg">Your guilds</h2>

      <AuthBoundary
        fallback={
          <div className="flex items-center gap-4 rounded-2xl bg-card px-5 py-6">
            <img src="/icons/robot.svg" alt="Guild Robot" className="size-8" />

            <p className="font-semibold">
              Sign in to view your guilds or create new ones
            </p>

            <Button
              colorScheme="primary"
              leftIcon={<SignIn weight="bold" />}
              className="ml-auto h-10"
            >
              Sign in
            </Button>
          </div>
        }
      >
        <Suspense fallback={<YourGuildsSkeleton />}>
          <YourGuilds />
        </Suspense>
      </AuthBoundary>
    </section>
  );
}

async function YourGuilds() {
  const { items: myGuilds } = await getAssociatedGuilds();

  return myGuilds.length > 0 ? (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {myGuilds.map((guild) => (
        <GuildCard key={guild.id} guild={guild} />
      ))}
    </div>
  ) : (
    <div className="flex items-center gap-4 rounded-2xl bg-card px-5 py-6">
      <img src="/icons/robot.svg" alt="Guild Robot" className="size-8" />

      <p className="font-semibold">
        You&apos;re not a member of any guilds yet. Explore and join some below,
        or create your own!
      </p>

      <Button leftIcon={<Plus weight="bold" />} className="ml-auto h-10">
        Create guild
      </Button>
    </div>
  );
}

function YourGuildsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <GuildCardSkeleton key={i} />
      ))}
    </div>
  );
}
