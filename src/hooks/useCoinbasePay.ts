import { CBPayInstance, InitOnRampParams, initOnRamp } from "@coinbase/cbpay-js"
import { useRef, useState } from "react"
import useToast from "./useToast"

const hideOverflow = () => {
  try {
    document.querySelector("body").style.overflow = "hidden"
  } catch {}
}

const showOverflow = () => {
  try {
    document.querySelector("body").style.overflow = ""
  } catch {}
}

// TODO: Wrap in a useSubmit, instead of using additional useState-s here
const useCoinbasePay = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const onrampInstance = useRef<CBPayInstance>()

  const toast = useToast()

  const onDone = () => {
    setIsLoading(false)
    showOverflow()
  }

  const onOpen = (destinationWalletAddress: string) => {
    setIsLoading(true)
    setError(undefined)

    const options: InitOnRampParams = {
      appId: process.env.NEXT_PUBLIC_COINBASE_PAY_APPID,
      target: "#cbpay-container",
      widgetParameters: {
        destinationWallets: [
          {
            address: destinationWalletAddress,

            // https://github.com/coinbase/cbpay-js/blob/d4bda2c05c4d5917c8db6a05476b603546046394/src/types/onramp.ts#L1
            blockchains: [
              "ethereum",
              "arbitrum",
              "avalanche-c-chain",
              "celo",
              "kava",
              "optimism",
              "polygon",
            ],
          },
        ],
      },
      onSuccess: () => {
        console.log("CB SUCCESS")
        onDone()
        toast({
          status: "success",
          title: "Coinbase Pay",
          description: "Wallet successfully topped up",
        })
      },
      onExit: (err) => {
        console.log("CB ERROR")
        onDone()
        if (err) {
          setError(err)
          toast({
            status: "error",
            title: "Coinbase Pay",
            description: "Failed to top up wallet",
          })
          console.error(err)
        } else {
          toast({
            status: "warning",
            title: "Coinbase Pay",
            description: "Operation cancelled",
          })
        }
      },
      onEvent: (event) => {
        console.log("CB PAY EVENT", event)

        if (event.eventName === "exit") {
          onrampInstance.current.destroy()
        }
      },
      experienceLoggedIn: "embedded",
      experienceLoggedOut: "embedded",
      debug: true,
    }

    if (onrampInstance.current) {
      onrampInstance.current.destroy()
    }

    initOnRamp(options, (e?: Error, instance?: CBPayInstance) => {
      if (instance) {
        onrampInstance.current = instance

        onrampInstance.current.open()

        try {
          hideOverflow()
          // document.getElementById(CB_PAY_IFRAME_ID).style.zIndex = "99999"
        } catch {}
      } else if (e) {
        onDone()
        setError(e)
        console.error(e)
      }
    })
  }

  return { isLoading, onOpen, error }
}

export default useCoinbasePay
