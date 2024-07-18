"use client"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselDotButton,
  CarouselItem,
  useCarouselDotButton,
} from "@/components/ui/Carousel"
import { Separator } from "@/components/ui/Separator"
import { cn } from "@/lib/utils"
import Autoplay from "embla-carousel-autoplay"
import { useRef, useState } from "react"
import { GuildPassScene } from "./GuildPassScene"

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
      "Get help within hours — even our CEO is answering priority tickets",
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
      "Shape Guild's future — your ideas drive what we build and when we build it",
    isAvailable: false,
  },
  {
    title: "Very top secret stuff",
    description:
      "There are things we can't tell you just yet — you'll have to see them for yourself",
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
    pricing: "0.1 ETH one time",
    description:
      "For Guild’s biggest supporters, who are excited for the future of Guild",
  },
] as const satisfies Subscription[]

export const GuildPassPicker = () => {
  const [api, setApi] = useState<CarouselApi>()
  const { selectedIndex, scrollSnaps, onCarouselDotButtonClick } =
    useCarouselDotButton(api)
  const carouselPlugins = useRef([
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  ])

  return (
    <Card className="mx-auto flex max-w-3lg flex-col bg-gradient-to-b from-card to-card-secondary">
      <h1 className="mt-8 mb-14 text-center font-bold text-2xl leading-none tracking-tighter">
        Choose your pass
      </h1>
      <Carousel
        className="cursor-grab active:cursor-grabbing"
        setApi={setApi}
        plugins={carouselPlugins.current}
      >
        <CarouselContent className="md:-ml-0 md:justify-center">
          {SUBSCRIPTIONS.map(({ title, description, pricing }, i) => (
            <CarouselItem className="select-none md:basis-1/3 md:pl-0" key={title}>
              <article className="relative flex h-full flex-col items-center pb-6 text-center">
                <div className="mb-4 h-48 w-full">
                  <GuildPassScene />
                </div>
                <div className="px-4">
                  <h2 className="font-extrabold text-lg">{title}</h2>
                  <strong className="font-extrabold text-lg text-orange-500">
                    {pricing}
                  </strong>
                  <p className="max-w-xs text-balance pt-2 text-muted-foreground text-sm">
                    {description}
                  </p>
                  <Button colorScheme="primary" className="mt-6 w-full md:hidden">
                    Purchase
                  </Button>
                </div>
                {i < SUBSCRIPTIONS.length - 1 && (
                  <Separator
                    orientation="vertical"
                    className="absolute right-0 hidden bg-[none] bg-gradient-to-t from-border to-60% md:block"
                  />
                )}
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="mb-4 space-x-3 self-center md:hidden">
        {scrollSnaps.map((_, index) => (
          <CarouselDotButton
            key={index}
            onClick={() => onCarouselDotButtonClick(index)}
            isActive={index === selectedIndex}
          />
        ))}
      </div>
      <div className="space-y-4 border-border border-t-2 bg-muted p-8">
        <h2 className="text-center font-bold text-muted-foreground text-xl leading-none tracking-tighter">
          Benefits
        </h2>
        <p className="pb-4 text-center text-muted-foreground">
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
                <div className="absolute top-2 right-1 w-24 translate-x-1/3 rotate-45 select-none bg-card py-1 text-center font-semibold text-xs">
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
