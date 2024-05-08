import { Center, Img, useColorModeValue } from "@chakra-ui/react"
import { useConnectors, useIsConnected } from "@fuel-wallet/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { useEffect, useState } from "react"
import { connectorButtonProps } from "./ConnectorButton"

const FuelConnectorButtons = () => {
  const { connectors } = useConnectors()
  const { isConnected } = useIsConnected()

  const fueletLogo = useColorModeValue(
    "/walletLogos/fuelet-black.svg",
    "/walletLogos/fuelet-white.svg"
  )

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
            leftIcon={
              <Center boxSize={6}>
                <Img
                  src={connectorIcons[connector.name]}
                  maxW={6}
                  maxH={6}
                  alt={connector.name}
                />
              </Center>
            }
            isLoading={connector.name === activatingConnector}
            loadingText="Connecting..."
            {...connectorButtonProps}
          >
            {connector.name}
          </Button>
        ))}
    </>
  )
}

export default FuelConnectorButtons
