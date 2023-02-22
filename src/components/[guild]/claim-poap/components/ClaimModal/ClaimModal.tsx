import {
  Box,
  Divider,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuList,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { BigNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { Error } from "components/common/Error"
import NetworkButtonsList from "components/common/Layout/components/Account/components/NetworkModal/components/NetworkButtonsList"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import useIsMember from "components/[guild]/hooks/useIsMember"
import useUser from "components/[guild]/hooks/useUser"
import ConnectPlatform from "components/[guild]/JoinModal/components/ConnectPlatform"
import JoinStep from "components/[guild]/JoinModal/components/JoinStep"
import WalletAuthButton from "components/[guild]/JoinModal/components/WalletAuthButton"
import WalletAuthButtonWithBalance from "components/[guild]/JoinModal/components/WalletAuthButtonWithBalance"
import useJoin from "components/[guild]/JoinModal/hooks/useJoin"
import processJoinPlatformError from "components/[guild]/JoinModal/utils/processJoinPlatformError"
import { Chains } from "connectors"
import useBalance from "hooks/useBalance"
import useTokenData from "hooks/useTokenData"
import {
  ArrowSquareOut,
  CaretDown,
  Check,
  CheckCircle,
  CurrencyCircleDollar,
  LinkBreak,
} from "phosphor-react"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import { GuildPoap, Poap } from "types"
import useClaimPoap from "../../hooks/useClaimPoap"
import usePoapAllowance from "../../hooks/usePoapAllowance"
import usePoapPayFee from "../../hooks/usePoapPayFee"
import useUserPoapEligibility from "../../hooks/useUserPoapEligibility"
import PayFeeMenuItem from "./components/PayFeeMenuItem"

type Props = {
  isOpen: boolean
  onClose: () => void
  poap: Poap
  guildPoap: GuildPoap
}

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

const ClaimModal = ({ isOpen, onClose, poap, guildPoap }: Props): JSX.Element => {
  const { isActive, account, chainId } = useWeb3React()
  const { id: userId } = useUser()

  const methods = useForm({
    mode: "all",
    defaultValues: {
      platforms: {},
    },
  })
  const { handleSubmit } = methods

  const vaultId = guildPoap?.poapContracts
    ?.map((poapContract) => poapContract.chainId)
    ?.includes(chainId)
    ? guildPoap?.poapContracts?.find(
        (poapContract) => poapContract?.chainId === chainId
      )?.vaultId
    : guildPoap?.poapContracts?.[0]?.vaultId
  const vaultChainId = guildPoap?.poapContracts
    ?.map((poapContract) => poapContract.chainId)
    ?.includes(chainId)
    ? chainId
    : guildPoap?.poapContracts?.[0]?.chainId
  const { vaultData, isVaultLoading } = usePoapVault(vaultId, vaultChainId)

  const isMonetized = typeof vaultId === "number"
  const isWrongChain =
    chainId &&
    guildPoap?.poapContracts?.length &&
    !guildPoap?.poapContracts
      ?.map((poapContract) => poapContract.chainId)
      .includes(chainId)

  const {
    data: { symbol, decimals },
    isValidating: isTokenDataLoading,
  } = useTokenData(Chains[vaultChainId], vaultData?.token)

  const { poapLinks } = usePoapLinks(poap?.id)

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

  const { onSubmit: onPayFeeSubmit, loadingText: payFeeLoadingText } = usePoapPayFee(
    vaultId,
    vaultChainId,
    guildPoap.fancyId
  )
  const [childLoadingText, setChildLoadingText] = useState<string>(null)
  const loadingText = payFeeLoadingText || childLoadingText

  const { poapEventDetails } = usePoapEventDetails(poap?.id)

  const {
    data: { hasPaid, voiceEligibility },
    isLoading: hasPaidLoading,
  } = useUserPoapEligibility(poap?.id)

  const isMember = useIsMember()

  const {
    isOpen: isChangeNetworkModalOpen,
    onOpen: onChangeNetworkModalOpen,
    onClose: onChangeNetworkModalClose,
  } = useDisclosure()

  const multiChainMonetized = guildPoap?.poapContracts?.length > 1

  const {
    coinBalance,
    tokenBalance,
    isLoading: isBalanceLoading,
  } = useBalance(vaultData?.token, vaultChainId)

  const sufficientBalance = (
    vaultData?.token === NULL_ADDRESS ? coinBalance : tokenBalance
  )?.gte(vaultData?.fee ?? BigNumber.from(0))

  const allowance = usePoapAllowance(vaultData?.token, vaultChainId)

  const formattedPrice = formatUnits(vaultData?.fee ?? "0", decimals ?? 18)

  const payButtonLabel = isWrongChain
    ? "Switch chain"
    : hasPaid
    ? "Paid fee"
    : vaultData?.token === NULL_ADDRESS ||
      allowance?.gte(vaultData?.fee ?? BigNumber.from(0))
    ? `Pay ${formattedPrice} ${symbol}`
    : `Approve ${formattedPrice} ${symbol} & Pay`

  const payButtonActionName = isWrongChain
    ? "Switch chain"
    : hasPaid
    ? "Paid fee"
    : "Pay (ClaimModal)"

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent overflow="visible">
          <FormProvider {...methods}>
            <ModalHeader pr={16}>Mint {poap?.name} POAP</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Error
                error={
                  joinError ||
                  (joinResponse?.success === false && !isJoinLoading && "NO_ACCESS")
                }
                processError={processJoinPlatformError}
              />
              {!claimPoapResponse ? (
                <>
                  <VStack
                    spacing="3"
                    alignItems="stretch"
                    w="full"
                    divider={<Divider />}
                  >
                    {isMonetized ? (
                      <WalletAuthButtonWithBalance
                        token={{
                          address: vaultData?.token,
                          symbol,
                          decimals: decimals ?? 18,
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
                          (!isActive && "Connect wallet first") ||
                          (!guildPoap?.activated && "Inactive POAP") ||
                          (poapLinks?.claimed === poapLinks?.total &&
                            "All POAPs are minted already") ||
                          (poapEventDetails?.voiceChannelId &&
                            !voiceEligibility &&
                            !isWrongChain &&
                            "You don't satisfy the voice participation requirement for this POAP") ||
                          (multiChainMonetized && isWrongChain && "Wrong network") ||
                          (!sufficientBalance && "Insufficient balance")
                        }
                        isDone={hasPaid}
                        isLoading={
                          isVaultLoading ||
                          hasPaidLoading ||
                          !!loadingText ||
                          (isTokenDataLoading && !symbol && !decimals) ||
                          isBalanceLoading
                        }
                        loadingText={loadingText ?? "Loading"}
                        title={hasPaid ? "Fee paid" : "Pay fee"}
                        buttonLabel={payButtonLabel}
                        datadogActionName={payButtonActionName}
                        colorScheme="blue"
                        icon={
                          isWrongChain ? (
                            <Icon as={LinkBreak} />
                          ) : hasPaid ? (
                            <Icon as={Check} rounded="full" />
                          ) : (
                            <Icon as={CurrencyCircleDollar} />
                          )
                        }
                        onClick={
                          isWrongChain && !multiChainMonetized
                            ? onChangeNetworkModalOpen
                            : onPayFeeSubmit
                        }
                        addonButton={
                          !hasPaid &&
                          multiChainMonetized && (
                            <Menu placement="bottom-end">
                              <MenuButton
                                as={IconButton}
                                icon={<CaretDown />}
                                colorScheme="blue"
                                borderLeftRadius={0}
                                isDisabled={
                                  !guildPoap.activated ||
                                  poapLinks?.claimed === poapLinks?.total ||
                                  (poapEventDetails?.voiceChannelId &&
                                    !voiceEligibility)
                                }
                              />
                              <MenuList zIndex="modal">
                                {guildPoap.poapContracts.map((poapContract) => (
                                  <PayFeeMenuItem
                                    key={poapContract.id}
                                    poapContractData={poapContract}
                                    setLoadingText={setChildLoadingText}
                                    fancy_id={guildPoap.fancyId}
                                  />
                                ))}
                              </MenuList>
                            </Menu>
                          )
                        }
                      />
                    )}
                  </VStack>

                  <Tooltip
                    label="There is no more claimable POAP left from this collection."
                    isDisabled={
                      (vaultData && hasPaid) || poapLinks?.claimed < poapLinks?.total
                    }
                  >
                    <Box>
                      <ModalButton
                        mt={8}
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
                        // Checking isMember's type here, so we don't trigger the join action by mistake
                        isDisabled={
                          typeof isMember === "undefined" ||
                          (isMonetized
                            ? !hasPaid
                            : poapLinks?.claimed === poapLinks?.total) ||
                          !isActive ||
                          !userId
                        }
                        data-dd-aciton-name="Get minting link"
                      >
                        Get minting link
                      </ModalButton>
                    </Box>
                  </Tooltip>
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
                      <Text as="span" noOfLines={1}>
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
        size={{ base: "lg", md: "2xl", lg: "4xl" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change network</ModalHeader>
          <ModalBody>
            <NetworkButtonsList
              networkChangeCallback={onChangeNetworkModalClose}
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
