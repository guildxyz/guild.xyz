import { AuthBoundary } from "@/components/AuthBoundary";
import { GuildCardSkeleton } from "@/components/GuildCard";
import { GuildCard } from "@/components/GuildCard";
import { SignInButton } from "@/components/SignInButton";
import { env } from "@/lib/env";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { CreateGuildLink } from "./_components/CreateGuildLink";
import { HeaderBackground } from "./_components/HeaderBackground";
import { InfiniteScrollGuilds } from "./_components/InfiniteScrollGuilds";
import { StickyNavbar } from "./_components/StickyNavbar";
import { StickySearch } from "./_components/StickySearch";
import { ACTIVE_SECTION } from "./constants";
import { getGuildSearch } from "./fetchers";

const getAssociatedGuilds = async () => {
  const request = `${env.NEXT_PUBLIC_API}/guild/search?page=1&pageSize=24&sortBy=name&reverse=false&search=`;
  const guilds = (await (
    await fetch(request)
  ).json()) as PaginatedResponse<Guild>;

  return guilds;
};

export default async function Explorer() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["guilds", ""],
    initialPageParam: 1,
    queryFn: getGuildSearch(""),
  });

  return (
    <>
      <main className="container mx-auto grid max-w-screen-lg gap-4 px-4 py-8">
        <section className="pt-6 pb-8">
          <h1
            className="font-black font-display text-5xl tracking-tight"
            id={ACTIVE_SECTION.yourGuilds}
          >
            Guildhall
          </h1>
        </section>

        <HeaderBackground />
        <StickyNavbar>
          <AuthBoundary fallback={null}>
            <CreateGuildLink />
          </AuthBoundary>
        </StickyNavbar>

        <YourGuildsSection />

        <h2
          className="mt-12 font-bold text-lg tracking-tight"
          id={ACTIVE_SECTION.exploreGuilds}
        >
          Explore verified guilds
        </h2>
        <StickySearch />

        <HydrationBoundary state={dehydrate(queryClient)}>
          <InfiniteScrollGuilds />
        </HydrationBoundary>
      </main>
    </>
  );
}

async function YourGuildsSection() {
  return (
    <section className="grid gap-2">
      <AuthBoundary
        fallback={
          <div className="flex items-center gap-4 rounded-2xl bg-card px-5 py-6">
            <img src="/images/robot.svg" alt="Guild Robot" className="size-8" />

            <p className="font-semibold">
              Sign in to view your guilds or create new ones
            </p>

            <SignInButton className="ml-auto" />
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

  return myGuilds && myGuilds.length > 0 ? (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {myGuilds.map((guild) => (
        <GuildCard key={guild.id} guild={guild} />
      ))}
    </div>
  ) : (
    <div className="flex items-center gap-4 rounded-2xl bg-card px-5 py-6">
      <img src="/images/robot.svg" alt="Guild Robot" className="size-8" />

      <p className="font-semibold">
        You&apos;re not a member of any guilds yet. Explore and join some below,
        or create your own!
      </p>

      <CreateGuildLink />
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
