import { GuildImage } from "@/components/GuildImage";
import { Button } from "@/components/ui/Button";
import type { DynamicRoute } from "@/lib/types";
import { type PropsWithChildren, Suspense } from "react";
import { GuildTabs, GuildTabsSkeleton } from "./components/GuildTabs";
import { getGuild } from "./fetchers";

const GuildPage = async ({
  params,
  children,
}: PropsWithChildren<DynamicRoute<{ guildId: string }>>) => {
  const { guildId: urlName } = await params;
  const guild = await getGuild(urlName);

  return (
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
            <Button colorScheme="success" className="rounded-2xl">
              Join Guild
            </Button>
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
  );
};

export default GuildPage;
