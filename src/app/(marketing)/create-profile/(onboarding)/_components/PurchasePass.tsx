"use client"

import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/Separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { DotLottiePlayer } from "@dotlottie/react-player"
import { ArrowLeft, Info } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { CreateProfileStep } from "../types"
import { GuildPassScene } from "./GuildPassScene"

export const PurchasePass: CreateProfileStep = ({ dispatchAction, data }) => {
  const [didUserPurchase, setDidUserPurchase] = useState(false)
  if (!data.chosenSubscription) throw new Error("Subscription data was not provided")

  const { title, pricingShort } = data.chosenSubscription

  useEffect(() => {
    if (didUserPurchase) dispatchAction({ action: "next" })
  }, [didUserPurchase])

  return (
    <div className="w-[28rem]">
      <div className="mt-8 mb-4 px-8">
        <Button
          onClick={() => dispatchAction({ action: "previous" })}
          className="h-auto p-0"
          size="lg"
          variant="unstyled"
        >
          <ArrowLeft weight="bold" />
          <span className="font-bold font-display">Purchase Pass</span>
        </Button>
      </div>
      <article className="flex flex-col items-center pb-6 text-center">
        <div className="mb-2 h-48">
          {didUserPurchase ? (
            <DotLottiePlayer
              autoplay
              src="/success_lottie.json"
              className="size-full"
            />
          ) : (
            <GuildPassScene sceneVariant={title} />
          )}
        </div>
        <div className="flex w-full justify-between px-8">
          <h2 className="font-extrabold text-lg">{title}</h2>
          <strong className="font-bold text-foreground text-lg">
            {pricingShort}
          </strong>
        </div>
      </article>
      <div className="space-y-4 border-border border-t bg-background p-8">
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
            <Button colorScheme="primary" onClick={() => setDidUserPurchase(true)}>
              Start
            </Button>
          </div>
          <Separator variant="muted" />

          {title === "Lifetime Pass" ? (
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
      </div>
    </div>
  )
}
