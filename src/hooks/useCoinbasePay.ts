import { CBPayInstance, InitOnRampParams, initOnRamp } from "@coinbase/cbpay-js"
import { useRef, useState } from "react"
import useToast from "./useToast"

// TODO: Wrap in a useSubmit, instead of using additional useState-s here
const useCoinbasePay = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const onrampInstance = useRef<CBPayInstance>()

  const toast = useToast()

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
            blockchains: ["ethereum", "algorand"], // TODO
          },
        ],
      },
      onSuccess: () => {
        setIsLoading(false)
        toast({
          status: "success",
          title: "Coinbase Pay",
          description: "Wallet successfully topped up",
        })
      },
      onExit: (err) => {
        setIsLoading(false)
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
      } else if (e) {
        setIsLoading(false)
        setError(e)
        console.error(e)
      }
    })
  }

  return { isLoading, onOpen, error }
}

export default useCoinbasePay
