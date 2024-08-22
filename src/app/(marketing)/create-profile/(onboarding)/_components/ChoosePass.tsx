"use client"

import { Button } from "@/components/ui/Button"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselDotButton,
  CarouselItem,
  useCarouselDotButton,
} from "@/components/ui/Carousel"
import { Separator } from "@/components/ui/Separator"
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group"
import { useEffect, useState } from "react"
import { SUBSCRIPTIONS } from "../constants"
import { CreateProfileStep } from "../types"
import { Benefits } from "./Benefits"
import { GuildPassScene } from "./GuildPassScene"

export const ChoosePass: CreateProfileStep = ({ dispatchAction }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [subscriptionIndex, setSubscriptionIndex] = useState<number>()
  const { selectedIndex, scrollSnaps, onCarouselDotButtonClick } =
    useCarouselDotButton(api)
  useEffect(() => {
    if (subscriptionIndex === undefined) return
    dispatchAction({
      action: "next",
      data: {
        chosenSubscription: SUBSCRIPTIONS[subscriptionIndex],
      },
    })
  }, [subscriptionIndex, dispatchAction])

  return (
    <div className="max-w-screen-lg">
      <h1 className="mt-8 mb-4 h-10 text-center font-bold font-display text-2xl leading-none tracking-tight ">
        Choose your pass
      </h1>
      <Carousel
        className={"cursor-pointer active:cursor-grabbing lg:hidden"}
        setApi={setApi}
        opts={{
          startIndex: 1,
        }}
      >
        <CarouselContent>
          {SUBSCRIPTIONS.map(({ title, description, pricing }, i) => (
            <CarouselItem className="select-none" key={title}>
              <article className="flex h-full flex-col items-center pb-6 text-center">
                <div className="mb-2 h-48 w-full">
                  <GuildPassScene sceneVariant={title} />
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
                    onClick={() => setSubscriptionIndex(i)}
                  >
                    Purchase
                  </Button>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="mb-4 flex justify-center space-x-3 lg:hidden">
        {scrollSnaps.map((_, i) => (
          <CarouselDotButton
            key={i}
            onClick={() => onCarouselDotButtonClick(i)}
            isActive={i === selectedIndex}
          />
        ))}
      </div>

      <ToggleGroup type="single" className="relative hidden items-end lg:flex">
        {SUBSCRIPTIONS.map(({ title, description, pricing }, i) => (
          <ToggleGroupItem
            value={title}
            onClick={() => setSubscriptionIndex(i)}
            className={
              "relative w-full select-none from-accent outline-none hover:bg-gradient-to-t focus-visible:bg-gradient-to-t focus-visible:ring-4 focus-visible:ring-ring"
            }
            key={title}
          >
            <article className="flex flex-col items-center pb-6 text-center">
              <div className="mb-2 h-48">
                <GuildPassScene sceneVariant={title} />
              </div>
              <div className="px-8">
                <h2 className="font-extrabold text-lg">{title}</h2>
                <strong className="font-extrabold text-lg text-orange-500">
                  {pricing}
                </strong>
                <p className="max-w-xs text-balance pt-2 text-muted-foreground text-sm">
                  {description}
                </p>
              </div>
              {i < SUBSCRIPTIONS.length - 1 && (
                <Separator
                  orientation="vertical"
                  className="absolute right-0 block bg-[none] bg-gradient-to-t from-border to-60%"
                />
              )}
            </article>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="space-y-2 border-border border-t bg-background p-8">
        <Benefits />
      </div>
    </div>
  )
}
