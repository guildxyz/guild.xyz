import { Flex, HStack, Icon, Text, useDisclosure, Wrap } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useCreatePoapContext } from "components/[guild]/CreatePoap/components/CreatePoapContext"
import useGuild from "components/[guild]/hooks/useGuild"
import { Plus } from "phosphor-react"
import { useEffect } from "react"
import MonetizationModal from "./components/MonetizationModal"
import MonetizedPoapCard from "./components/MonetizedPoapCard"

type Props = {
  shouldOpenModal?: boolean
}

const MonetizePoap = ({ shouldOpenModal }: Props): JSX.Element => {
  const { poaps } = useGuild()
  const { poapData } = useCreatePoapContext()

  const currentPoap = poaps?.find((p) => p.poapIdentifier === poapData?.id)

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (!shouldOpenModal) return
    onOpen()
  }, [shouldOpenModal])

  return (
    <>
      <Wrap spacing={0}>
        {currentPoap?.poapContracts?.map((poapContract) => (
          <HStack key={poapContract.id} spacing={0} pb={2}>
            <MonetizedPoapCard
              poapContractId={poapContract.id}
              vaultId={poapContract.vaultId}
              chainId={poapContract.chainId}
              deleteDisabled={currentPoap?.activated}
            />
            <Flex alignItems="center" justifyContent="center" w={10}>
              <Text
                as="span"
                textTransform="uppercase"
                color="gray"
                fontSize="sm"
                fontWeight="bold"
              >
                or
              </Text>
            </Flex>
          </HStack>
        ))}

        <Button
          leftIcon={<Icon as={Plus} />}
          h={10}
          borderRadius="lg"
          onClick={onOpen}
        >
          Add payment method
        </Button>
      </Wrap>

      <MonetizationModal {...{ isOpen, onClose }} />
    </>
  )
}

export default MonetizePoap
