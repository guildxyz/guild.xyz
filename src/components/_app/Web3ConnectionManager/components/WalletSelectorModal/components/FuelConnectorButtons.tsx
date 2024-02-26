import { Center, Img, useColorModeValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import useFuel, { FuelConnectorName } from "hooks/useFuel"
import { connectorButtonProps } from "./ConnectorButton"

const FuelConnectorButtons = () => {
  const { connectors, connect, connectorName, isConnecting } = useFuel()

  const fueletLogo = useColorModeValue(
    "/walletLogos/fuelet-black.svg",
    "/walletLogos/fuelet-white.svg"
  )

  const connectorIcons: Record<FuelConnectorName, string> = {
    "Fuel Wallet": "/walletLogos/fuel.svg",
    "Fuelet Wallet": fueletLogo,
  }

  return (
    <>
      {connectors.map((connector) => (
        <Button
          key={connector.name}
          onClick={() =>
            connect({
              connector: connector.name,
            })
          }
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
          isLoading={connector.name === connectorName && isConnecting}
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
