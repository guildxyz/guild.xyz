import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  HStack,
  Icon,
  IconButton,
  Img,
  Skeleton,
  SkeletonCircle,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { Alert } from "components/common/Modal"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import { TrashSimple } from "phosphor-react"
import { useEffect, useRef } from "react"
import useDeleteMonetization from "../hooks/useDeleteMonetization"

type Props = {
  poapContractId: number
  vaultId: number
  chainId: number
  deleteDisabled?: boolean
}

const MonetizedPoapCard = ({
  poapContractId,
  vaultId,
  chainId,
  deleteDisabled,
}: Props): JSX.Element => {
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

  return (
    <>
      <Card borderRadius="lg" h={10} w="max-content">
        <HStack pl={4} pr={deleteDisabled ? 4 : 2} h={10}>
          <SkeletonCircle
            boxSize={4}
            isLoaded={!isVaultLoading && !isTokenDataLoading}
          >
            <Img
              src={RPC[Chains[chainId]]?.iconUrls?.[0]}
              alt={RPC[Chains[chainId]]?.chainName}
              boxSize={4}
            />
          </SkeletonCircle>
          <Skeleton as="span" isLoaded={!isVaultLoading && !isTokenDataLoading}>
            <Text as="span" fontWeight="semibold">{`Pay ${formatUnits(
              vaultData?.fee ?? "0",
              decimals ?? 18
            )} ${symbol ?? RPC[Chains[chainId]]?.nativeCurrency?.symbol} on ${
              RPC[Chains[chainId]]?.chainName
            }`}</Text>
          </Skeleton>

          {!deleteDisabled && !isVaultLoading && !isTokenDataLoading && (
            <IconButton
              aria-label="Delete monetization"
              icon={<Icon as={TrashSimple} />}
              size="sm"
              rounded="full"
              colorScheme="red"
              variant="ghost"
              onClick={onOpen}
            />
          )}
        </HStack>
      </Card>

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
    </>
  )
}

export default MonetizedPoapCard
