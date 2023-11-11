import { Center, Img, useColorModeValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import useFuel from "hooks/useFuel"

const FuelConnectorButtons = () => {
  const { connect, isConnecting } = useFuel()

  const fueletLogo = useColorModeValue(
    "/walletLogos/fuelet-black.svg",
    "/walletLogos/fuelet-white.svg"
  )

  return !!window.fuelet ? (
    <Button
      mb={4}
      onClick={connect}
      rightIcon={
        <Center boxSize={6}>
          <Img src={fueletLogo} maxW={6} maxH={6} alt="Fuelet logo" />
        </Center>
      }
      w="full"
      size="xl"
      justifyContent="space-between"
      isLoading={isConnecting}
      loadingText="Fuelet - connecting..."
      spinnerPlacement="end"
    >
      Fuelet
    </Button>
  ) : (
    <Button
      mb={4}
      onClick={connect}
      rightIcon={
        <Center boxSize={6}>
          <Img src="/walletLogos/fuel.svg" maxW={6} maxH={6} alt="Fuel logo" />
        </Center>
      }
      w="full"
      size="xl"
      justifyContent="space-between"
      isLoading={isConnecting}
      loadingText="Fuel - connecting..."
      spinnerPlacement="end"
    >
      Fuel
    </Button>
  )
}

export default FuelConnectorButtons
