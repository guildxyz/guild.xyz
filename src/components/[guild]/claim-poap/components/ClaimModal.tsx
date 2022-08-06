import {
  Box,
  Divider,
  HStack,
  Icon,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Error } from "components/common/Error"
import requestNetworkChange from "components/common/Layout/components/Account/components/NetworkModal/utils/requestNetworkChange"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import useIsMember from "components/[guild]/hooks/useIsMember"
import ConnectPlatform from "components/[guild]/JoinModal/components/ConnectPlatform"
import JoinStep from "components/[guild]/JoinModal/components/JoinStep"
import WalletAuthButton from "components/[guild]/JoinModal/components/WalletAuthButton"
import WalletAuthButtonWithBalance from "components/[guild]/JoinModal/components/WalletAuthButtonWithBalance"
import useJoin from "components/[guild]/JoinModal/hooks/useJoin"
import processJoinPlatformError from "components/[guild]/JoinModal/utils/processJoinPlatformError"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"
import {
  ArrowSquareOut,
  Check,
  CheckCircle,
  CurrencyCircleDollar,
} from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import { GuildPoap, Poap } from "types"
import newNamedError from "utils/newNamedError"
import useClaimPoap from "../hooks/useClaimPoap"
import useHasPaid from "../hooks/useHasPaid"
import usePayFee from "../hooks/usePayFee"

type Props = {
  isOpen: boolean
  onClose: () => void
  poap: Poap
  guildPoap: GuildPoap
}

const ClaimModal = ({ isOpen, onClose, poap, guildPoap }: Props): JSX.Element => {
  const { isActive, account, chainId } = useWeb3React()

  const methods = useForm({
    mode: "all",
    defaultValues: {
      platforms: {},
    },
  })
  const { handleSubmit } = methods

  const { vaultData, isVaultLoading } = usePoapVault(poap?.id, guildPoap?.chainId)

  const isMonetized = typeof vaultData?.id === "number"
  const isWrongChain =
    chainId && guildPoap?.contract && guildPoap?.chainId !== chainId

  const {
    data: { symbol, decimals },
    isValidating: isTokenDataLoading,
  } = useTokenData(Chains[guildPoap?.chainId], vaultData?.token)

  const {
    onSubmit: onClaimPoapSubmit,
    isLoading: isClaimPoapLoading,
    response: claimPoapResponse,
  } = useClaimPoap(poap)

  const {
    response: joinResponse,
    isLoading: isJoinLoading,
    onSubmit: onJoinSubmit,
    error: joinError,
    isSigning,
    signLoadingText,
  } = useJoin(onClaimPoapSubmit)

  const { onSubmit: onPayFeeSubmit, loadingText } = usePayFee()

  const { hasPaid, hasPaidLoading } = useHasPaid()
  const isMember = useIsMember()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <FormProvider {...methods}>
          <ModalHeader>Claim {poap?.name} POAP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Error
              error={
                joinError ||
                (joinResponse?.success === false && !isJoinLoading && "NO_ACCESS") ||
                (isWrongChain &&
                  newNamedError(
                    "Wrong network",
                    `Please switch to ${
                      RPC[Chains[guildPoap?.chainId]]?.chainName
                    } in order to pay for this POAP!`
                  ))
              }
              processError={processJoinPlatformError}
            >
              {isWrongChain && (
                <Button
                  size="sm"
                  onClick={requestNetworkChange(Chains[guildPoap?.chainId])}
                >
                  Switch
                </Button>
              )}
            </Error>
            {!claimPoapResponse ? (
              <>
                <VStack
                  spacing="3"
                  alignItems="strech"
                  w="full"
                  divider={<Divider />}
                >
                  {isMonetized ? (
                    <WalletAuthButtonWithBalance
                      token={{
                        address: vaultData?.token,
                        symbol,
                        decimals,
                        name: "",
                      }}
                    />
                  ) : (
                    <WalletAuthButton />
                  )}
                  <ConnectPlatform platform={"DISCORD"} />
                  {isMonetized && (
                    <JoinStep
                      isRequired
                      isDisabled={
                        !isActive ||
                        isWrongChain ||
                        hasPaidLoading ||
                        hasPaid ||
                        isVaultLoading ||
                        !!loadingText
                      }
                      isDone={hasPaid}
                      isLoading={
                        hasPaidLoading ||
                        !!loadingText ||
                        (isTokenDataLoading && !symbol && !decimals)
                      }
                      loadingText={loadingText}
                      title={hasPaid ? "Fee paid" : "Pay fee"}
                      buttonLabel={`${hasPaid ? "Paid" : "Pay"} ${formatUnits(
                        vaultData?.fee ?? "0",
                        decimals ?? 18
                      )} ${symbol}`}
                      colorScheme={"blue"}
                      icon={
                        hasPaid ? (
                          <Icon as={Check} rounded="full" />
                        ) : (
                          <Icon as={CurrencyCircleDollar} />
                        )
                      }
                      onClick={onPayFeeSubmit}
                    />
                  )}
                </VStack>

                <ModalButton
                  mt="8"
                  onClick={isMember ? onClaimPoapSubmit : handleSubmit(onJoinSubmit)}
                  colorScheme="green"
                  isLoading={isSigning || isJoinLoading || isClaimPoapLoading}
                  loadingText={
                    signLoadingText ||
                    (isJoinLoading && "Joining guild") ||
                    (isClaimPoapLoading && "Getting your link")
                  }
                  isDisabled={!isActive || (isMonetized && !hasPaid)}
                >
                  Get minting link
                </ModalButton>
              </>
            ) : (
              <HStack spacing={0}>
                <Icon
                  as={CheckCircle}
                  color="green.500"
                  boxSize="16"
                  weight="light"
                />
                <Box pl="6" w="calc(100% - var(--chakra-sizes-16))">
                  <Text>{`You can mint your POAP on the link below:`}</Text>
                  <Link
                    mt={2}
                    maxW="full"
                    href={`${claimPoapResponse}?address=${account}`}
                    colorScheme="blue"
                    isExternal
                    fontWeight="semibold"
                  >
                    <Text as="span" isTruncated>
                      {`${claimPoapResponse}?address=${account}`}
                    </Text>
                    <Icon as={ArrowSquareOut} />
                  </Link>
                </Box>
              </HStack>
            )}
          </ModalBody>
        </FormProvider>
      </ModalContent>
      <DynamicDevTool control={methods.control} />
    </Modal>
  )
}

export default ClaimModal
