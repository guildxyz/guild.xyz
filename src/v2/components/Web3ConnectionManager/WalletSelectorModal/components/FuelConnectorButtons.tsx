import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { Button } from "@/components/ui/Button"
import { useConnectors, useIsConnected } from "@fuels/react"
import { useEffect, useState } from "react"
import { connectorButtonBaseProps } from "./ConnectorButton"

const FuelConnectorButtons = () => {
  const { connectors } = useConnectors()
  const { isConnected } = useIsConnected()

  // const fueletLogo = useColorModeValue(
  //   "/walletLogos/fuelet-black.svg",
  //   "/walletLogos/fuelet-white.svg"
  // )
  // TODO: color mode support
  const fueletLogo = "/walletLogos/fuelet-black.svg"

  const connectorIcons: Record<string, string> = {
    "Fuel Wallet": "/walletLogos/fuel.svg",
    "Fuelet Wallet": fueletLogo,
  }

  const [activatingConnector, setActivatingConnector] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected) return
    setActivatingConnector(null)
  }, [isConnected])

  const { captureEvent, startSessionRecording } = usePostHogContext()

  return (
    <>
      {connectors
        ?.filter((connector) => connector.installed)
        .map((connector) => (
          <Button
            {...connectorButtonBaseProps}
            key={connector.name}
            onClick={() => {
              captureEvent("Click on Connect Fuel", {
                connectorName: connector?.name,
              })
              startSessionRecording()
              setActivatingConnector(connector.name)

              connector.connect().catch((error) => {
                setActivatingConnector(null)
                if (error?.message === "Connection rejected!") {
                  captureEvent("Fuel connection rejected", {
                    connectorName: connector?.name,
                  })
                } else {
                  captureEvent("Fuel connection error", {
                    error: error?.message,
                    originalError: error,
                    connectorName: connector?.name,
                  })
                }
              })
            }}
            isLoading={connector.name === activatingConnector}
            loadingText="Connecting..."
          >
            <div className="flex size-6 items-center justify-center">
              <img
                src={connectorIcons[connector.name]}
                className="size-6"
                alt={connector.name}
              />
            </div>
            {connector.name}
          </Button>
        ))}
    </>
  )
}

export default FuelConnectorButtons
