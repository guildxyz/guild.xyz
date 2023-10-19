import {
  Alert,
  AlertDescription,
  AlertIcon,
  ButtonProps,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import PoapReward from "components/[guild]/CreatePoap/components/PoapReward"
import usePoapLinks from "components/[guild]/CreatePoap/hooks/usePoapLinks"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import AlphaTag from "components/[guild]/Requirements/components/GuildCheckout/components/AlphaTag"
import {
  GuildCheckoutProvider,
  useGuildCheckoutContext,
} from "components/[guild]/Requirements/components/GuildCheckout/components/GuildCheckoutContex"
import PaymentMethodButtons from "components/[guild]/Requirements/components/GuildCheckout/components/PaymentMethodButtons"
import ConnectWalletButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/ConnectWalletButton"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import usePoapPayFee from "components/[guild]/claim-poap/hooks/usePoapPayFee"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { Chains } from "connectors"
import useTokenData from "hooks/useTokenData"
import { Coin } from "phosphor-react"
import usePoapById from "requirements/Poap/hooks/usePoapById"
import { GuildPoap, PoapContract } from "types"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { erc20ABI, useAccount, useChainId, useContractRead } from "wagmi"
import PoapBuyTotal from "./PoapBuyTotal"
import PoapPaymentFeeCurrency from "./PoapPaymentFeeCurrency"

type Props = { guildPoap: GuildPoap; poapContract: PoapContract } & ButtonProps

/**
 * This is copy-pasted from BuyPass and adjusted to work with legacy POAP logic. We
 * will switch to general payment requirement once POAP is a real reward
 */
const BuyPoapRequirement = ({ guildPoap, poapContract, ...rest }: Props) => {
  const { vaultId, chainId: vaultChainId } = poapContract
  const { isConnected } = useAccount()
  const chainId = useChainId()

  const { poap } = usePoapById(guildPoap?.poapIdentifier?.toString())
  const { vaultData, isVaultLoading } = usePoapVault(vaultId, vaultChainId)
  const { poapLinks } = usePoapLinks(guildPoap?.poapIdentifier)

  const { isOpen, onOpen, onClose } = useGuildCheckoutContext()

  const isWrongChain = chainId !== vaultChainId

  const { data: allowance } = useContractRead({
    abi: erc20ABI,
    address: vaultData?.token === NULL_ADDRESS ? undefined : vaultData?.token,
    functionName: "allowance",
    chainId: vaultChainId,
  })

  const {
    data: { symbol },
    isValidating: isTokenDataLoading,
  } = useTokenData(Chains[vaultChainId], vaultData?.token)

  const payButtonLabel = isWrongChain
    ? "Switch chain"
    : // : hasPaid
    // ? "Paid fee"
    vaultData?.token === NULL_ADDRESS || allowance >= (vaultData?.fee ?? 0)
    ? `Pay`
    : `Approve ${symbol} & Pay`

  const { onSubmit: onPayFeeSubmit, loadingText: payFeeLoadingText } = usePoapPayFee(
    vaultId,
    vaultChainId,
    poap?.fancy_id,
    { onSuccess: onClose }
  )

  const userSatisfiesOtherRequirements = true /* accessData?.requirements
    ?.filter((r) => r.requirementId !== requirement?.id)
    ?.every((r) => r.access) */

  if (
    !poap ||
    poapLinks?.claimed === poapLinks?.total
    // (!accessData && isAccessLoading) ||
    // !paymentSupportedChains.includes(requirement?.chain)
  )
    return null

  const isDisabled = isWrongChain || isVaultLoading || isTokenDataLoading

  return (
    <>
      <Button
        colorScheme="blue"
        size="sm"
        leftIcon={<Icon as={Coin} />}
        borderRadius="lg"
        fontWeight="medium"
        onClick={onOpen}
        {...rest}
      >
        Pay
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="duotone">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4} pr={16}>
            <Text as="span" mr={2}>{`Pay ${poap.name} fee`}</Text>
            <AlphaTag />
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {!userSatisfiesOtherRequirements && (
              <Alert
                status="warning"
                bgColor="orange.100"
                color="black"
                mb="6"
                pb="5"
              >
                <AlertIcon color="orange.500" />
                <Stack>
                  <AlertDescription position="relative" top={1}>
                    There're other requirements you don't satisfy, so the pass alone
                    won't grant you access
                  </AlertDescription>
                </Stack>
              </Alert>
            )}

            <PoapReward poap={poap} isInteractive={false} />
          </ModalBody>

          <ModalFooter pt={10} flexDir="column">
            <PaymentMethodButtons />

            <Stack spacing={8} w="full">
              <PoapPaymentFeeCurrency />
              <PoapBuyTotal />

              <Stack
                spacing={2}
                sx={{
                  ".chakra-collapse": {
                    overflow: "unset!important",
                    overflowX: "visible",
                    overflowY: "hidden",
                  },
                }}
              >
                {!isConnected ? (
                  <ConnectWalletButton />
                ) : (
                  <>
                    <SwitchNetworkButton targetChainId={vaultChainId} />

                    <Button
                      size="lg"
                      isLoading={payFeeLoadingText}
                      isDisabled={isDisabled}
                      colorScheme={!isDisabled ? "blue" : "gray"}
                      loadingText={payFeeLoadingText}
                      w="full"
                      onClick={onPayFeeSubmit}
                    >
                      {payButtonLabel}
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const BuyPassWrapper = ({ guildPoap, poapContract, ...rest }: Props) => (
  <GuildCheckoutProvider>
    <BuyPoapRequirement {...{ guildPoap, poapContract }} {...rest} />
  </GuildCheckoutProvider>
)

export default BuyPassWrapper
