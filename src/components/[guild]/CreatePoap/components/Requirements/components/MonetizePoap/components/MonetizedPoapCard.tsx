import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Circle,
  HStack,
  Icon,
  IconButton,
  Img,
  Skeleton,
  SkeletonCircle,
  Stack,
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
      <Card position="relative" px={{ base: 5, sm: 6 }} py={7}>
        <HStack spacing={{ base: 5, sm: 10 }}>
          <SkeletonCircle
            boxSize={10}
            isLoaded={!isVaultLoading && !isTokenDataLoading}
          >
            <Circle size={10} bgColor="gray.100">
              <Img
                src={RPC[Chains[chainId]]?.iconUrls?.[0]}
                alt={RPC[Chains[chainId]]?.chainName}
                boxSize={6}
              />
            </Circle>
          </SkeletonCircle>

          <Stack spacing={0.5}>
            <Skeleton isLoaded={!isVaultLoading && !isTokenDataLoading} h={5}>
              <Text as="span" fontWeight="bold">
                {RPC[Chains[chainId]]?.chainName}
              </Text>
            </Skeleton>

            <Skeleton isLoaded={!isVaultLoading && !isTokenDataLoading} h={4}>
              <Text as="span" fontSize="sm" color="gray">
                {`${formatUnits(vaultData?.fee ?? "0", decimals ?? 18)} ${
                  symbol ?? RPC[Chains[chainId]]?.nativeCurrency?.symbol
                }`}
              </Text>
            </Skeleton>
          </Stack>
        </HStack>

        {!deleteDisabled && !isVaultLoading && !isTokenDataLoading && (
          <IconButton
            position="absolute"
            top={2}
            right={2}
            aria-label="Delete monetization"
            icon={<Icon as={TrashSimple} />}
            size="sm"
            rounded="full"
            colorScheme="red"
            variant="ghost"
            onClick={onOpen}
          />
        )}
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
                onClick={onSubmit}
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
