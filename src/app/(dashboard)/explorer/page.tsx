import { AuthBoundary } from "@/components/AuthBoundary";
import { ConnectDiscord } from "@/components/ConnectDiscord";
import { SignInButton } from "@/components/SignInButton";
import { Suspense } from "react";
import {
  AssociatedGuilds,
  AssociatedGuildsSkeleton,
} from "./components/AssociatedGuilds";
import { CreateGuildLink } from "./components/CreateGuildLink";
import { HeaderBackground } from "./components/HeaderBackground";
import { InfiniteScrollGuilds } from "./components/InfiniteScrollGuilds";
import { StickyNavbar } from "./components/StickyNavbar";
import { StickySearch } from "./components/StickySearch";
import { ACTIVE_SECTION } from "./constants";

const Explorer = async () => {
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
            id={ACTIVE_SECTION.associatedGuilds}
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

        <AssociatedGuildsSection />

        {/* TODO: delete this before merging the PR */}
        <section>
          <h2 className="mt-12 font-bold text-lg tracking-tight">
            Connect Discord
          </h2>
          <AuthBoundary
            fallback={
              <p>You must sign in before connecting your Discord account</p>
            }
          >
            <ConnectDiscord />
          </AuthBoundary>
        </section>

        <h2
          className="mt-12 font-bold text-lg tracking-tight"
          id={ACTIVE_SECTION.exploreGuilds}
        >
          Explore verified guilds
        </h2>
        <StickySearch />

        <InfiniteScrollGuilds />
      </main>
    </>
  );
};

async function AssociatedGuildsSection() {
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
        <Suspense fallback={<AssociatedGuildsSkeleton />}>
          <AssociatedGuilds />
        </Suspense>
      </AuthBoundary>
    </section>
  );
}

export default Explorer;
