import { Header } from "@/components/Header";
import { ScrollBar } from "@/components/ui/ScrollArea";
import EmblaCarousel from "@/components/ui/carousel/EmblaCarousel";
import { Binoculars, TrendUp } from "@phosphor-icons/react/dist/ssr";
import type { EmblaOptionsType } from "embla-carousel";
import FadedScrollArea from "./FadedScrollArea";
import { GuildCard } from "./components/GuildCard";
import { GuildShortcut } from "./components/GuildShortcut";
import { ProfileCard } from "./components/ProfileCard";
import { RewardCard } from "./components/RewardCard";
import { RoleCard } from "./components/RoleCard";

const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
const OPTIONS: EmblaOptionsType = { loop: true };

const Explorer = async () => {
  return (
    <>
      <Header />
      <div className="mx-auto w-full max-w-screen-lg px-4 sm:px-8 md:px-10">
        <div
          className="-z-10 absolute top-0 right-0 left-0 h-80 bg-[center_top_0.5rem] bg-[length:theme(screens.lg)_auto] bg-[url('/images/banner-light.svg')] bg-repeat opacity-10 dark:bg-[url('/images/banner.svg')] dark:opacity-5"
          style={{
            maskImage:
              "radial-gradient(ellipse at top, var(--background), transparent 90%)",
          }}
        />

        <main className="container relative mx-auto grid gap-4 py-4">
          <section className="overflow-hidden">
            <FadedScrollArea className="w-full max-w-full">
              <div className="flex gap-2 py-2">
                {Array.from({ length: 15 }).map((_, index) => (
                  <GuildShortcut key={index} href={`/guilds/${index}`}>
                    <p>Merchant Moes Best Kitchen</p>
                  </GuildShortcut>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="opacity-0" />
            </FadedScrollArea>
          </section>

          <section className="">
            <EmblaCarousel slides={SLIDES} options={OPTIONS} />
          </section>

          <div className="relative w-full rounded-2xl border border-blackAlpha-medium bg-card-secondary p-4 pr-12 transition-colors hover:cursor-pointer hover:bg-card dark:border-whiteAlpha-medium">
            <Binoculars
              size={24}
              weight="bold"
              className="absolute top-4 right-4 text-blackAlpha-hard dark:text-whiteAlpha-hard"
            />
            <p className="select-none">
              Browse guilds, roles, people and more...
            </p>
          </div>

          <hr className="my-6" />

          <section className="overflow-hidden">
            <h2 className="mb-4 font-bold text-xl">Trending Guilds</h2>
            <FadedScrollArea className="w-full max-w-full">
              <div className="flex gap-4">
                {Array.from({ length: 15 }).map((_, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <GuildCard className="w-[260px] lg:w-[320px] " />
                    <div className="rounded-2xl bg-blue-400 p-4 font-semibold text-sm">
                      <p className="text-center">
                        <TrendUp
                          size={16}
                          weight="bold"
                          className="mr-1 inline-block"
                        />{" "}
                        12.51% <span className="opacity-50">in Members</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="opacity-0" />
            </FadedScrollArea>
          </section>

          <section className="mt-12 overflow-hidden">
            <h2 className="mb-4 font-bold text-xl">Trending Roles</h2>

            <div className="lg:hidden">
              <FadedScrollArea className="w-full max-w-full">
                <div className="flex flex-row gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div className="flex flex-col gap-3" key={index}>
                      <RoleCard className="w-96" />
                      <div className="rounded-2xl bg-blue-400 p-4 font-semibold text-sm">
                        <p className="text-center">
                          <TrendUp
                            size={16}
                            weight="bold"
                            className="mr-1 inline-block"
                          />{" "}
                          12.51% <span className="opacity-50">in Members</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="opacity-0" />
              </FadedScrollArea>
            </div>

            {/* Visible on large screens, hidden on mobile */}
            <div className="hidden lg:block">
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div className="flex flex-row gap-3" key={index}>
                    <div className="flex w-min flex-col items-center justify-center rounded-2xl bg-blue-400 p-3 font-semibold text-sm">
                      <TrendUp size={16} weight="bold" />
                      <p className="text-center">
                        12.51% <span className="opacity-50">in Members</span>
                      </p>
                    </div>
                    <RoleCard className="w-full" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-12 overflow-hidden">
            <h2 className="mb-4 font-bold text-xl">
              Hottest Airdrops & Rewards 🔥
            </h2>
            <FadedScrollArea className="w-full max-w-full">
              <div className="flex gap-4">
                {Array.from({ length: 15 }).map((_, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <RewardCard className="w-60" />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="opacity-0" />
            </FadedScrollArea>
          </section>

          <section className="mt-12 overflow-hidden">
            <h2 className="mb-4 font-bold text-xl">Trending Guilders</h2>
            <FadedScrollArea className="w-full max-w-full">
              <div className="flex gap-4">
                {Array.from({ length: 15 }).map((_, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <ProfileCard className="w-60" />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="opacity-0" />
            </FadedScrollArea>
          </section>
        </main>
      </div>
    </>
  );
};

export default Explorer;
