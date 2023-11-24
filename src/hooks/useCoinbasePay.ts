import { CBPayInstance, InitOnRampParams, initOnRamp } from "@coinbase/cbpay-js"
import { useRef } from "react"

const useCoinbasePay = (target = "#cbpay-container") => {
  const onrampInstance = useRef<CBPayInstance>()

  const onOpen = (destinationWalletAddress: string) => {
    // initOnRamp parameters
    const options: InitOnRampParams = {
      appId: process.env.NEXT_PUBLIC_COINBASE_PAY_APPID,
      // target,
      widgetParameters: {
        destinationWallets: [
          {
            address: destinationWalletAddress,
            blockchains: ["ethereum", "algorand"], // TODO
          },
        ],
      },
      onSuccess: () => {
        console.log("CB PAY SUCCESS")
        // handle navigation when user successfully completes the flow
      },
      onExit: (err) => {
        console.log("CB PAY ERROR")
        if (err) {
          console.error(err)
        }
        // handle navigation from dismiss / exit events due to errors
      },
      onEvent: (event) => {
        // event stream
        console.log("CB PAY EVENT", event)
      },
      experienceLoggedIn: "popup", // "embedded",
      experienceLoggedOut: "popup",
    }

    // instance.destroy() should be called before initOnramp if there is already an instance.
    if (onrampInstance.current) {
      onrampInstance.current.destroy()
    }

    initOnRamp(options, (error?: Error, instance?: CBPayInstance) => {
      if (instance) {
        onrampInstance.current = instance
        onrampInstance.current.open()
      } else if (error) {
        console.error(error)
      }
    })
  }

  return onOpen
}

export default useCoinbasePay
