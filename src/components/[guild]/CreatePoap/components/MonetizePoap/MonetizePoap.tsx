import { Flex, Stack, Text, useDisclosure } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { useCreatePoapContext } from "../CreatePoapContext"
import MonetizationModal from "./components/MonetizationModal"
import MonetizedPoapCard from "./components/MonetizedPoapCard"

const MonetizePoap = (): JSX.Element => {
  const { poaps } = useGuild()
  const { nextStep, poapData } = useCreatePoapContext()

  const currentPoap = poaps?.find((p) => p.poapIdentifier === poapData?.id)

  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Stack>
      <Text mb="6">
        You can set different payment methods that the users will be able to choose
        from to get the POAP
      </Text>
      <Stack maxW="sm" spacing={4}>
        {currentPoap?.poapContracts?.map((poapContract) => (
          <MonetizedPoapCard
            key={poapContract.id}
            poapContractId={poapContract.id}
            vaultId={poapContract.vaultId}
            chainId={poapContract.chainId}
          />
        ))}

        <AddCard text="Add payment method" onClick={onOpen} />
      </Stack>

      <Flex justifyContent="end">
        {currentPoap?.poapContracts?.length > 0 ? (
          <Button colorScheme="indigo" onClick={nextStep}>
            Continue
          </Button>
        ) : (
          <Button onClick={nextStep}>Skip</Button>
        )}
      </Flex>

      <MonetizationModal {...{ isOpen, onClose }} />
    </Stack>
  )
}

export default MonetizePoap
