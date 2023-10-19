import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  CloseButton,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { Alert } from "components/common/Modal"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import { useEffect, useRef } from "react"
import { GuildPoap, PoapContract } from "types"
import PoapPaymentRequirement from "./PoapPaymentRequirement"
import useDeleteMonetization from "./hooks/useDeleteMonetization"

type Props = { guildPoap: GuildPoap; poapContract: PoapContract }

const PoapPaymentRequirementEditable = ({ guildPoap, poapContract }: Props) => {
  const { id: poapContractId, vaultId, chainId } = poapContract

  const { vaultData } = usePoapVault(vaultId, chainId)

  const {
    data: { symbol },
  } = useTokenData(Chains[chainId], vaultData.token)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const removeRef = useRef()

  const { onSubmit, isLoading, response } = useDeleteMonetization(poapContractId)

  useEffect(() => {
    if (!response) return
    onClose()
  }, [response])

  const removeButtonColor = useColorModeValue("gray.700", "gray.400")

  return (
    <Card px="6" py="4" pr="8" pos="relative">
      <PoapPaymentRequirement {...{ guildPoap, poapContract }} />

      <CloseButton
        ref={removeRef}
        position="absolute"
        top={2}
        right={2}
        color={removeButtonColor}
        borderRadius={"full"}
        size="sm"
        onClick={onOpen}
        aria-label="Remove requirement"
      />

      <Alert
        {...{ isOpen, onClose }}
        leastDestructiveRef={cancelRef}
        finalFocusRef={removeRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{`Remove ${
              symbol ?? RPC[Chains[chainId]]?.nativeCurrency?.symbol
            } payment requirement`}</AlertDialogHeader>
            <AlertDialogBody>Are you sure?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                onClick={() => onSubmit({})}
                isLoading={isLoading}
                loadingText="Deleting monetization"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </Alert>
    </Card>
  )
}

export default PoapPaymentRequirementEditable
