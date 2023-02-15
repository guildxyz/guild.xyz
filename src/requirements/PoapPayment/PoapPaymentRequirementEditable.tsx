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
import Button from "components/common/Button"
import Card from "components/common/Card"
import { Alert } from "components/common/Modal"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import { useEffect, useRef } from "react"
import { GuildPoap, PoapContract } from "types"
import useDeleteMonetization from "./hooks/useDeleteMonetization"
import PoapPaymentRequirement from "./PoapPaymentRequirement"

type Props = { poap: GuildPoap; poapContract: PoapContract }

const PoapPaymentRequirementEditable = ({ poap, poapContract, ...props }: Props) => {
  const { id: poapContractId, vaultId, chainId } = poapContract
  const deleteDisabled = poap?.activated

  const { isVaultLoading, vaultData } = usePoapVault(vaultId, chainId)

  const {
    data: { symbol, decimals },
    isValidating: isTokenDataLoading,
  } = useTokenData(Chains[chainId], vaultData?.token)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  const { onSubmit, isLoading, response } = useDeleteMonetization(poapContractId)

  useEffect(() => {
    if (!response) return
    onClose()
  }, [response])

  const removeButtonColor = useColorModeValue("gray.700", "gray.400")

  return (
    <Card px="6" py="4" pr="8" pos="relative">
      <PoapPaymentRequirement {...{ poap, poapContract }} />

      <CloseButton
        position="absolute"
        top={2}
        right={2}
        color={removeButtonColor}
        borderRadius={"full"}
        size="sm"
        onClick={onOpen}
        aria-label="Remove requirement"
        isDisabled={!deleteDisabled && !isVaultLoading && !isTokenDataLoading}
      />

      <Alert {...{ isOpen, onClose }} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Are you sure?</AlertDialogHeader>
            <AlertDialogBody>
              {`If you delete this monetization, users won't be able to pay for your POAP with ${
                symbol ?? RPC[Chains[chainId]]?.nativeCurrency?.symbol
              }.`}
            </AlertDialogBody>
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
