import { Center, Img } from "@chakra-ui/react"
import { useKeyPair } from "components/_app/KeyPairProvider"
import Button from "components/common/Button"
import GuildAvatar from "components/common/GuildAvatar"
import useFuel from "hooks/useFuel"
import shortenHex from "utils/shortenHex"

const FuelConnectorButtons = () => {
  const { connect, isConnecting, isConnected, address } = useFuel()
  const { ready } = useKeyPair()

  return (
    <Button
      mb={4}
      onClick={connect}
      rightIcon={
        isConnected && ready ? (
          <GuildAvatar address={address} size={5} />
        ) : (
          <Center boxSize={6}>
            <Img src="/walletLogos/fuel.svg" maxW={6} maxH={6} alt="Fuel logo" />
          </Center>
        )
      }
      w="full"
      size="xl"
      justifyContent="space-between"
      isDisabled={isConnected}
      isLoading={isConnecting}
      loadingText="Fuel - connecting..."
      spinnerPlacement="end"
    >
      {isConnected ? shortenHex(address) : "Fuel"}
    </Button>
  )
}

export default FuelConnectorButtons
