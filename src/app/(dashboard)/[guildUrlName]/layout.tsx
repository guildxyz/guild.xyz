import { AuthBoundary } from "@/components/AuthBoundary";
import { GuildImage } from "@/components/GuildImage";
import { getQueryClient } from "@/lib/getQueryClient";
import {
  guildOptions,
  pageBatchOptions,
  rewardBatchOptions,
  roleBatchOptions,
  userOptions,
} from "@/lib/options";
import type { DynamicRoute } from "@/lib/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { type PropsWithChildren, Suspense } from "react";
import { GuildTabs, GuildTabsSkeleton } from "./components/GuildTabs";
import { JoinButton } from "./components/JoinButton";

const GuildLayout = async ({
  params,
  children,
}: PropsWithChildren<DynamicRoute<{ guildUrlName: string }>>) => {
  const { guildUrlName } = await params;
  const queryClient = getQueryClient();

  // TODO: handle possible request failures
  await Promise.all([
    queryClient.prefetchQuery(userOptions()),
    queryClient.prefetchQuery(pageBatchOptions({ guildIdLike: guildUrlName })),
    queryClient.prefetchQuery(
      guildOptions({
        guildIdLike: guildUrlName,
      }),
    ),
  ]);

  const pageBatch = queryClient.getQueryData(
    pageBatchOptions({ guildIdLike: guildUrlName }).queryKey,
  );
  const roleBatchOptionsCollection = pageBatch?.map((page) => {
    return roleBatchOptions({
      pageIdLike: page.urlName!,
      guildIdLike: guildUrlName,
    });
  });

  if (roleBatchOptionsCollection) {
    await Promise.all(
      roleBatchOptionsCollection.map((c) => queryClient.prefetchQuery(c)),
    );
    const rewardBatchOptionsCollection = [];
    for (const options of roleBatchOptionsCollection) {
      const roles = queryClient.getQueryData(options.queryKey);
      if (!roles) continue;
      for (const { id } of roles) {
        rewardBatchOptionsCollection.push(rewardBatchOptions({ roleId: id }));
      }
    }
    await Promise.all(
      rewardBatchOptionsCollection.map((c) => queryClient.prefetchQuery(c)),
    );
  }

  const guild = queryClient.getQueryState(
    guildOptions({
      guildIdLike: guildUrlName,
    }).queryKey,
  );

  if (guild?.error || !guild?.data) {
    throw new Error(`Failed to fetch guild ${guild?.error?.status || ""}`);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="py-16">
        <div className="flex flex-col items-stretch pb-4 md:flex-row md:justify-between">
          <div className="w-full space-y-4">
            <div className="flex w-full flex-col items-stretch justify-between gap-8 md:flex-row md:items-center">
              <div className="flex max-w-prose items-center gap-4">
                <GuildImage
                  name={guild.data.name}
                  imageUrl={guild.data.imageUrl}
                  className="size-20 rounded-full border"
                />
                <h1 className="text-pretty font-bold font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
                  {guild.data.name}
                </h1>
              </div>
              {/* TODO: JoinButton should open a modal where the user can sign in and also connect the required platforms. So we won't need an AuthBoundary here. */}
              <AuthBoundary fallback={null}>
                <JoinButton />
              </AuthBoundary>
            </div>
            <p className="line-clamp-3 max-w-prose text-balance text-lg leading-relaxed">
              {guild.data.description}
            </p>
          </div>
        </div>

        <Suspense fallback={<GuildTabsSkeleton />}>
          <GuildTabs />
        </Suspense>

        {children}
      </main>
    </HydrationBoundary>
  );
};

export default GuildLayout;
