import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/Separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { DotLottiePlayer } from "@dotlottie/react-player"
import { ArrowLeft, Info } from "@phosphor-icons/react"
import { useState } from "react"
import { OnboardingChain } from "../types"
import { GuildPassScene } from "./GuildPassScene"

export const PurchasePass: OnboardingChain = ({
  dispatchChainAction,
  chainData,
}) => {
  const [didPurchase, setDidPurchase] = useState(false)
  const [didAllowEth, setDidAllowEth] = useState(false)
  const [didVerify, setDidVerify] = useState(false)

  if (!chainData.chosenSubscription)
    throw new Error("Subscription data was not provided")

  const { title, pricingShort } = chainData.chosenSubscription

  return (
    <div className="w-[28rem]">
      <div className="mt-8 mb-4 px-8">
        <Button
          onClick={() => dispatchChainAction("previous")}
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
          {didPurchase ? (
            <DotLottiePlayer
              autoplay
              src="/success_lottie.json"
              className="size-full"
            />
          ) : (
            <GuildPassScene />
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
            <Button
              colorScheme="primary"
              onClick={() => setDidVerify(true)}
              disabled={didVerify}
            >
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
              <Button
                colorScheme="info"
                className="w-full"
                disabled={!didVerify || didAllowEth}
                onClick={() => {
                  setDidAllowEth(true)
                }}
              >
                Allow Guild to use your ETH
                <Info />
              </Button>
              <Button
                variant="subtle"
                className="w-full"
                disabled={!didVerify || !didAllowEth}
                onClick={() => setDidPurchase(true)}
              >
                Purchase
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between font-semibold">
              2. Complete payment
              <Button
                colorScheme="primary"
                disabled={!didVerify}
                onClick={() => setDidPurchase(true)}
              >
                Go to stripe
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
