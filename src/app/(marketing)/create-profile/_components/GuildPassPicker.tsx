"use client"

import { Card } from "@/components/ui/Card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/Carousel"
import { cn } from "@/lib/utils"
import Autoplay from "embla-carousel-autoplay"

interface Benefit {
  title: string
  description: string
  isAvailable: boolean
}

const BENEFITS = [
  {
    title: "Launch your Guild Profile",
    description: "Your onchain profile with achievements and XP level ",
    isAvailable: true,
  },
  {
    title: "Unlock exclusive rewards",
    description: "Pass holders can access unique and one-off rewards from guilds",
    isAvailable: true,
  },
  {
    title: "Get early access to Guild features",
    description: "Be the first to unlock and experience our newest features",
    isAvailable: true,
  },
  {
    title: "Priority support",
    description:
      "Get help within hours - even our CEO is answering priority tickets",
    isAvailable: true,
  },
  {
    title: "Manage your personal Guild",
    description:
      "Special access to gamified features to help creators engage their audience",
    isAvailable: false,
  },
  {
    title: "Alpha Explorer",
    description:
      "Unlock secret guilds and earn exclusive rewards before they become popular",
    isAvailable: false,
  },
  {
    title: "Be part of Gold community",
    description:
      "Shape Guild's future - your ideas drive what we build and when we build it",
    isAvailable: false,
  },
  {
    title: "Very top secret stuff",
    description:
      "There are things we can't tell you just yet - you'll have to see them for yourself",
    isAvailable: false,
  },
] as const satisfies Benefit[]

interface Subscription {
  title: string
  pricing: string
  description: string
}

const SUBSCRIPTIONS = [
  {
    title: "Single Pass",
    pricing: "$6 / month",
    description: "For the curious, who want to try Guild’s new features",
  },
  {
    title: "Bundle Pass",
    pricing: "$60 / year",
    description: "For the professionals, who would benefit from Guild continuously",
  },
  {
    title: "Lifetime Pass",
    pricing: "0.1ETH one time",
    description:
      "For Guild’s biggest supporters, who are excited for the future of Guild",
  },
] as const satisfies Subscription[]

export const GuildPassPicker = () => {
  return (
    <Card className="mx-auto max-w-3lg bg-gradient-to-b from-card to-card-secondary">
      <h1 className="mt-8 mb-14 text-center font-bold text-2xl leading-none tracking-tighter">
        Choose your pass
      </h1>
      <Carousel
        className="px-8"
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
      >
        <CarouselContent>
          {SUBSCRIPTIONS.map(({ title, description, pricing }, i) => (
            <CarouselItem
              className="cursor-grab select-none active:cursor-grabbing md:basis-1/3"
              key={title}
            >
              <article className="relative flex h-full flex-col items-center pb-6 text-center">
                <div className="mb-4 h-48 w-full outline">canvas</div>
                <div className="px-2">
                  <h2 className="font-extrabold text-lg">{title}</h2>
                  <strong className="font-extrabold text-lg text-orange-500">
                    {pricing}
                  </strong>
                  <p className="text-balance pt-2 text-muted-foreground text-sm">
                    {description}
                  </p>
                </div>
                {i < SUBSCRIPTIONS.length - 1 && (
                  <div className="absolute inset-y-0 right-0 hidden w-px bg-gradient-to-t from-border to-60% md:block" />
                )}
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="space-y-5 border-border border-t-2 bg-muted p-8">
        <h2 className="text-center font-bold text-muted-foreground text-xl leading-none tracking-tighter">
          Benefits
        </h2>
        <p className="text-center text-muted-foreground">
          All passes provide the same benefits
        </p>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {BENEFITS.map(({ title, description, isAvailable }) => (
            <Card
              className={cn("flex items-center gap-4 border-2 p-5", {
                "bg- relative border-dotted": !isAvailable,
              })}
              key={title}
            >
              {isAvailable || (
                <div className="absolute top-2 right-1 w-24 translate-x-1/3 rotate-45 bg-card py-1 text-center font-semibold text-xs">
                  Soon
                </div>
              )}
              <div className="flex aspect-square min-w-14 items-center justify-center rounded-xl bg-card-secondary">
                #
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </Card>
          ))}
        </div>
        <p className="pt-10 text-center text-muted-foreground">
          Prices are subject to change in the future
        </p>
      </div>
    </Card>
  )
}
