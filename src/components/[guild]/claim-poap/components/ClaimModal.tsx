import {
  Box,
  Divider,
  Flex,
  HStack,
  Icon,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Error } from "components/common/Error"
import NetworkButtonsList from "components/common/Layout/components/Account/components/NetworkModal/components/NetworkButtonsList"
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
  LinkBreak,
} from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import { GuildPoap, Poap } from "types"
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
  const networkModalSize = useBreakpointValue({ base: "lg", md: "2xl", lg: "4xl" })

  const { isActive, account, chainId } = useWeb3React()

  const methods = useForm({
    mode: "all",
    defaultValues: {
      platforms: {},
    },
  })
  const { handleSubmit } = methods

  const { vaultData, isVaultLoading } = usePoapVault(
    poap?.id,
    guildPoap?.poapContracts?.[0]?.chainId
  )

  const isMonetized = typeof vaultData?.id === "number"
  const isWrongChain =
    chainId &&
    guildPoap?.poapContracts?.length &&
    !guildPoap?.poapContracts
      ?.map((poapContract) => poapContract.chainId)
      .includes(chainId)

  const {
    data: { symbol, decimals },
    isValidating: isTokenDataLoading,
  } = useTokenData(Chains[chainId], vaultData?.token)

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

  const { hasPaid, hasPaidLoading } = useHasPaid(poap?.id)
  const isMember = useIsMember()

  const {
    isOpen: isChangeNetworkModalOpen,
    onOpen: onChangeNetworkModalOpen,
    onClose: onChangeNetworkModalClose,
  } = useDisclosure()

  return (
    <>
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
                  (joinResponse?.success === false && !isJoinLoading && "NO_ACCESS")
                }
                processError={processJoinPlatformError}
              >
                {!hasPaid && isWrongChain && (
                  <Button
                    size="sm"
                    onClick={
                      guildPoap?.poapContracts?.length > 1
                        ? onChangeNetworkModalOpen
                        : requestNetworkChange(
                            Chains[guildPoap?.poapContracts?.[0]?.chainId]
                          )
                    }
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
                          symbol:
                            symbol || RPC[Chains[chainId]]?.nativeCurrency?.symbol,
                          decimals: decimals ?? 18,
                          name: "",
                        }}
                      />
                    ) : (
                      <WalletAuthButton />
                    )}
                    <ConnectPlatform platform={"DISCORD"} />
                    {isMonetized && (
                      <>
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
                          )} ${
                            symbol || RPC[Chains[chainId]]?.nativeCurrency?.symbol
                          }`}
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
                        {!hasPaid && (
                          <Flex mt={1} justifyContent="end">
                            <Button
                              variant="link"
                              fontSize="xs"
                              fontWeight="medium"
                              onClick={
                                !hasPaid && isWrongChain
                                  ? guildPoap?.poapContracts?.length > 1
                                    ? onChangeNetworkModalOpen
                                    : requestNetworkChange(
                                        Chains[
                                          guildPoap?.poapContracts?.[0]?.chainId
                                        ]
                                      )
                                  : onChangeNetworkModalOpen
                              }
                              color={isWrongChain ? "red.500" : "gray"}
                            >
                              <HStack spacing={1}>
                                <Text as="span">
                                  {isWrongChain
                                    ? "Wrong chain"
                                    : `on ${RPC[Chains[chainId]]?.chainName}`}
                                </Text>
                                {isWrongChain ? <LinkBreak /> : <ArrowSquareOut />}
                              </HStack>
                            </Button>
                          </Flex>
                        )}
                      </>
                    )}
                  </VStack>

                  <ModalButton
                    mt={hasPaid ? 8 : 4}
                    onClick={
                      isMember ? onClaimPoapSubmit : handleSubmit(onJoinSubmit)
                    }
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

      <Modal
        isOpen={isChangeNetworkModalOpen}
        onClose={onChangeNetworkModalClose}
        size={networkModalSize}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change network</ModalHeader>
          <ModalBody>
            <NetworkButtonsList
              manualNetworkChangeCallback={onChangeNetworkModalClose}
              listedChainIDs={guildPoap?.poapContracts?.map(
                (poapContract) => poapContract.chainId
              )}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ClaimModal
