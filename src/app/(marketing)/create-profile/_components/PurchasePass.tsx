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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { cn } from "@/lib/utils"
import { ArrowLeft, Info } from "@phosphor-icons/react"
import Autoplay from "embla-carousel-autoplay"
import { useRef, useState } from "react"
import { Benefits } from "./Benefits"
import { GuildPassScene } from "./GuildPassScene"

interface Subscription {
  title: string
  pricing: string
  description: string
  pricingShort: string
}

const SUBSCRIPTIONS = [
  {
    title: "Single Pass",
    pricing: "$6 / month",
    pricingShort: "$6 / month",
    description: "For the curious, who want to try Guild’s new features",
  },
  {
    title: "Bundle Pass",
    pricing: "$60 / year",
    pricingShort: "$60 / year",
    description: "For the professionals, who would benefit from Guild continuously",
  },
  {
    title: "Lifetime Pass",
    pricing: "0.1 ETH one time",
    pricingShort: "0.1 ETH",
    description:
      "For Guild’s biggest supporters, who are excited for the future of Guild",
  },
] as const satisfies Subscription[]

export const PurchasePass = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState<number>()
  const didUserSelect = activeIndex !== undefined
  const { selectedIndex, scrollSnaps, onCarouselDotButtonClick } =
    useCarouselDotButton(api)
  const carouselPlugins = useRef([
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  ])

  return (
    <Card
      className={cn(
        "mx-auto flex max-w-3lg flex-col bg-gradient-to-b from-card to-card-secondary shadow-2xl",
        { "max-w-md": didUserSelect }
      )}
    >
      <div className="mt-8 mb-4 px-8">
        {didUserSelect ? (
          <Button
            onClick={() => setActiveIndex(undefined)}
            className="h-10 pl-0"
            size="lg"
            variant="unstyled"
          >
            <ArrowLeft weight="bold" />
            <span className="font-bold font-display">Purchase Pass</span>
          </Button>
        ) : (
          <h1 className="h-10 text-center font-bold font-display text-2xl leading-none tracking-tight">
            Choose your pass
          </h1>
        )}
      </div>
      <Carousel
        className={cn("cursor-pointer active:cursor-grabbing lg:hidden", {
          hidden: didUserSelect,
        })}
        setApi={setApi}
        plugins={carouselPlugins.current}
      >
        <CarouselContent>
          {SUBSCRIPTIONS.map(({ title, description, pricing }, i) => (
            <CarouselItem className="select-none" key={title}>
              <article className="flex h-full flex-col items-center pb-6 text-center">
                <div className="mb-2 h-48 w-full">
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
                  <Button
                    colorScheme="primary"
                    className="mt-6 w-full"
                    onClick={() => setActiveIndex(i)}
                  >
                    Purchase
                  </Button>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div
        className={cn("mb-4 space-x-3 self-center lg:hidden", {
          hidden: didUserSelect,
        })}
      >
        {scrollSnaps.map((_, i) => (
          <CarouselDotButton
            key={i}
            onClick={() => onCarouselDotButtonClick(i)}
            isActive={i === selectedIndex}
          />
        ))}
      </div>

      <div
        className={cn("relative hidden items-end lg:flex", {
          flex: didUserSelect,
        })}
      >
        {SUBSCRIPTIONS.map(({ title, description, pricing, pricingShort }, i) => (
          <button
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative w-full from-accent outline-none hover:bg-gradient-to-t focus-visible:bg-gradient-to-t",
              {
                "-z-10 absolute opacity-0": didUserSelect && activeIndex !== i,
                "w-full cursor-auto hover:bg-none": activeIndex === i,
              }
            )}
            key={title}
            disabled={didUserSelect}
          >
            <article className="flex flex-col items-center pb-6 text-center">
              <div className="mb-2 h-48">
                <GuildPassScene />
              </div>
              <div
                className={cn("px-8", {
                  "flex w-full justify-between": didUserSelect,
                })}
              >
                <h2 className="font-extrabold text-lg">{title}</h2>
                <strong
                  className={cn("font-extrabold text-lg text-orange-500", {
                    "font-bold text-foreground": didUserSelect,
                  })}
                >
                  {didUserSelect ? pricingShort : pricing}
                </strong>
                <p
                  className={cn(
                    "max-w-xs text-balance pt-2 text-muted-foreground text-sm",
                    { hidden: didUserSelect }
                  )}
                >
                  {description}
                </p>
              </div>
              {i < SUBSCRIPTIONS.length - 1 && (
                <Separator
                  orientation="vertical"
                  className={cn(
                    "absolute right-0 block bg-[none] bg-gradient-to-t from-border to-60%",
                    { "opacity-0": didUserSelect }
                  )}
                />
              )}
            </article>
          </button>
        ))}
      </div>
      <div className="space-y-4 border-border border-t bg-background p-8">
        {didUserSelect ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                1. Verification
                <Tooltip>
                  <TooltipTrigger>
                    <Info weight="bold" className="text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    We have to collect your personal details for legal reasons. They
                    won’t be shared anywhere on the website
                  </TooltipContent>
                </Tooltip>
              </div>
              <Button colorScheme="primary">Start</Button>
            </div>
            <Separator variant="muted" />

            {SUBSCRIPTIONS[activeIndex].title === "Lifetime Pass" ? (
              <div className="flex flex-col gap-3">
                <div className="mb-3 font-semibold">2. Complete payment</div>
                <div className="flex justify-between text-muted-foreground">
                  <div>Gas fee</div>
                  <div>0.03 ETH</div>
                </div>
                <div className="mb-3 flex justify-between text-muted-foreground">
                  <div>Total</div>
                  <div>---</div>
                </div>
                <Button colorScheme="info" className="w-full" disabled>
                  Allow Guild to use your ETH
                  <Info />
                </Button>
                <Button variant="subtle" className="w-full" disabled>
                  Purchase
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between font-semibold">
                2. Complete payment
                <Button colorScheme="primary" disabled>
                  Go to stripe
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Benefits />
        )}
      </div>
    </Card>
  )
}
