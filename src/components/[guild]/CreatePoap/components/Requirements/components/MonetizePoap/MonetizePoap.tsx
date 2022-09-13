import { Stack, Text, useDisclosure } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import { useCreatePoapContext } from "components/[guild]/CreatePoap/components/CreatePoapContext"
import useGuild from "components/[guild]/hooks/useGuild"
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
            deleteDisabled={currentPoap?.activated}
          />
        ))}

        <AddCard text="Add payment method" onClick={onOpen} />
      </Stack>

      <MonetizationModal {...{ isOpen, onClose }} />
    </Stack>
  )
}

export default MonetizePoap
