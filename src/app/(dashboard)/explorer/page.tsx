import { getAuthCookie as getTokenFromCookie } from "@/actions/auth";
import { AuthBoundary } from "@/components/AuthBoundary";
import { SignInButton } from "@/components/SignInButton";
import { env } from "@/lib/env";
import { fetcher } from "@/lib/fetcher";
import type { Guild } from "@/lib/schemas/guild";
import type { PaginatedResponse } from "@/lib/types";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { CreateGuildLink } from "./components/CreateGuildLink";
import { GuildCard, GuildCardSkeleton } from "./components/GuildCard";
import { HeaderBackground } from "./components/HeaderBackground";
import { InfiniteScrollGuilds } from "./components/InfiniteScrollGuilds";
import { StickyNavbar } from "./components/StickyNavbar";
import { StickySearch } from "./components/StickySearch";
import { ACTIVE_SECTION } from "./constants";
import { getGuildSearch } from "./fetchers";

const getAssociatedGuilds = async ({ userId }: { userId: string }) => {
  const request = `${env.NEXT_PUBLIC_API}/guild/search?page=1&pageSize=${Number.MAX_SAFE_INTEGER}&sortBy=name&reverse=false&customQuery=@owner:{${userId}}`;
  console.log(request);
  return fetcher<PaginatedResponse<Guild>>(request);
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
      <div
        className="-z-10 absolute top-0 right-0 left-0 h-80 bg-[center_top_0.5rem] bg-[length:theme(screens.lg)_auto] bg-[url('/images/banner-light.svg')] bg-repeat opacity-10 dark:bg-[url('/images/banner.svg')] dark:opacity-5"
        style={{
          maskImage:
            "radial-gradient(ellipse at top, var(--background), transparent 90%)",
        }}
      />

      <main className="container relative mx-auto grid gap-4 py-16">
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
          <div className="flex flex-col items-stretch gap-4 rounded-2xl bg-card px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/images/robot.svg"
                alt="Guild Robot"
                className="size-8"
              />

              <p className="font-semibold">
                Sign in to view your guilds or create new ones
              </p>
            </div>

            <SignInButton colorScheme="primary" />
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
  const auth = await getTokenFromCookie();
  if (!auth) return;

  const { items: myGuilds } = await getAssociatedGuilds({
    userId: auth.userId,
  });

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

      <CreateGuildLink className="ml-auto" />
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
