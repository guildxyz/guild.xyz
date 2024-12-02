import { getParsedToken } from "@/actions/auth";
import { AuthBoundary } from "@/components/AuthBoundary";
import { GuildImage } from "@/components/GuildImage";
import { SignInButton } from "@/components/SignInButton";
import { fetchGuildApiData } from "@/lib/fetchGuildApi";
import { getQueryClient } from "@/lib/getQueryClient";
import type { DynamicRoute } from "@/lib/types";
import type { Schemas } from "@guildxyz/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { type PropsWithChildren, Suspense } from "react";
import { GuildTabs, GuildTabsSkeleton } from "./components/GuildTabs";
import { JoinButton } from "./components/JoinButton";

const GuildLayout = async ({
  params,
  children,
}: PropsWithChildren<DynamicRoute<{ guildUrlName: string }>>) => {
  const { guildUrlName } = await params;
  const guild = await fetchGuildApiData<Schemas["GuildFull"]>(
    `guild/urlName/${guildUrlName}`,
  );
  const token = await getParsedToken();
  const user =
    token &&
    (await fetchGuildApiData<Schemas["UserFull"]>(`user/id/${token.userId}`));

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery({
    queryKey: ["catch"],
    queryFn: () => ({ test: 32 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="py-16">
        <div className="flex flex-col items-stretch pb-4 md:flex-row md:justify-between">
          <div className="w-full space-y-4">
            <div className="flex w-full flex-col items-stretch justify-between gap-8 md:flex-row md:items-center">
              <div className="flex max-w-prose items-center gap-4">
                <GuildImage
                  name={guild.name}
                  imageUrl={guild.imageUrl}
                  className="size-20 rounded-full border"
                />
                <h1 className="text-pretty font-bold font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
                  {guild.name}
                </h1>
              </div>
              <AuthBoundary fallback={<SignInButton />}>
                {user && <JoinButton guild={guild} user={user} />}
              </AuthBoundary>
            </div>
            <p className="line-clamp-3 max-w-prose text-balance text-lg leading-relaxed">
              {guild.description}
            </p>
          </div>
        </div>

        <Suspense fallback={<GuildTabsSkeleton />}>
          <GuildTabs guild={guild} />
        </Suspense>

        {children}
      </main>
    </HydrationBoundary>
  );
};

export default GuildLayout;
