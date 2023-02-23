import {
  Collapse,
  Divider,
  Icon,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/hooks/useIsMember"
import { Chains, RPC } from "connectors"
import { ShoppingCartSimple } from "phosphor-react"
import {
  PURCHASABLE_REQUIREMENT_TYPES,
  purchaseSupportedChains,
  PURCHASE_ALLOWED_GUILDS,
} from "utils/guildCheckout/constants"
import BlockExplorerUrl from "../BlockExplorerUrl"
import AlphaTag from "./components/AlphaTag"
import ConnectWalletButton from "./components/buttons/ConnectWalletButton"
import PurchaseAllowanceButton from "./components/buttons/PurchaseAllowanceButton"
import PurchaseButton from "./components/buttons/PurchaseButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"
import ErrorCollapse from "./components/ErrorCollapse"
import {
  GuildCheckoutProvider,
  useGuildCheckoutContext,
} from "./components/GuildCheckoutContex"
import InfoModal from "./components/InfoModal"
import PurchasedRequirementInfo from "./components/InfoModal/components/PurchasedRequirementInfo"
import TransactionLink from "./components/InfoModal/components/TransactionLink"
import PaymentCurrencyPicker from "./components/PaymentCurrencyPicker"
import PaymentMethodButtons from "./components/PaymentMethodButtons"
import PurchaseFeeAndTotal from "./components/PurchaseFeeAndTotal"
import TOSCheckbox from "./components/TOSCheckbox"
import usePrice from "./hooks/usePrice"

const PurchaseRequirement = (): JSX.Element => {
  const { account, chainId } = useWeb3React()
  const {
    requirement,
    isOpen,
    onOpen,
    onClose,
    isInfoModalOpen,
    txError,
    txSuccess,
    txHash,
  } = useGuildCheckoutContext()
  const { id, name } = useGuild()
  const { data: accessData, isLoading: isAccessLoading } = useAccess(
    requirement?.roleId
  )
  const satisfiesRequirement = accessData?.requirements?.find(
    (req) => req.requirementId === requirement.id
  )?.access
  const isMember = useIsMember()

  const {
    data: { priceInUSD },
    isValidating,
    error,
  } = usePrice(RPC[requirement?.chain]?.nativeCurrency?.symbol)

  if (
    !isOpen &&
    !isInfoModalOpen &&
    // TODO: we'll be able to control this properly once we'll have feature flags
    (!PURCHASE_ALLOWED_GUILDS.includes(id) ||
      (!accessData && isAccessLoading) ||
      satisfiesRequirement ||
      !PURCHASABLE_REQUIREMENT_TYPES.includes(requirement?.type) ||
      !purchaseSupportedChains[requirement?.type]?.includes(requirement?.chain))
  )
    return null

  return (
    <>
      <Button
        colorScheme="blue"
        size="xs"
        leftIcon={<Icon as={ShoppingCartSimple} />}
        borderRadius="md"
        fontWeight="medium"
        onClick={onOpen}
        data-dd-action-name="Purchase (Requierment)"
      >
        Purchase
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="duotone">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text as="span" mr={2}>
              Buy requirement
            </Text>
            <AlphaTag />
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <PurchasedRequirementInfo
              rightElement={
                isValidating ? (
                  <Spinner size="sm" />
                ) : (
                  <Text as="span">
                    {!isNaN(priceInUSD)
                      ? `${
                          priceInUSD < 0.01 ? "< $0.01" : `$${priceInUSD.toFixed(2)}`
                        }`
                      : ""}
                  </Text>
                )
              }
              footer={<BlockExplorerUrl />}
            />
          </ModalBody>

          <ModalFooter pt={10} flexDir="column">
            <PaymentMethodButtons />
            <ErrorCollapse error={error?.error} />

            <Stack spacing={8} w="full">
              <PaymentCurrencyPicker />
              <PurchaseFeeAndTotal />

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
                {!account ? (
                  <ConnectWalletButton />
                ) : (
                  !error && (
                    <>
                      <SwitchNetworkButton />

                      <Collapse in={chainId === Chains[requirement.chain]}>
                        <TOSCheckbox>
                          {`I understand that I purchase from decentralized exchanges, not from ${name} or Guild.xyz itself`}
                        </TOSCheckbox>

                        <PurchaseAllowanceButton />
                      </Collapse>
                    </>
                  )
                )}
                <PurchaseButton />
              </Stack>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <InfoModal
        title={
          txError
            ? "Transaction failed"
            : txSuccess
            ? "Purchase successful"
            : txHash
            ? "Transaction is processing..."
            : "Buy requirement"
        }
        progressComponent={
          <>
            <Text mb={4}>
              The blockchain is working its magic... Your transaction should be
              confirmed shortly
            </Text>

            <TransactionLink />

            <Divider mb={6} />

            <Stack spacing={4}>
              <Text as="span" fontWeight="bold">
                You'll get:
              </Text>

              <PurchasedRequirementInfo />
            </Stack>
          </>
        }
        successComponent={
          <>
            <Text mb={4}>
              {isMember
                ? "Your access is being rechecked"
                : "Join the Guild now to get your roles"}
            </Text>

            <TransactionLink />

            <Divider mb={6} />

            <Stack spacing={4}>
              <Text as="span" fontWeight="bold">
                Your new asset:
              </Text>

              <PurchasedRequirementInfo />
            </Stack>
          </>
        }
        errorComponent={
          <>
            <Text mb={4}>
              {"Couldn't purchase the assets. Learn about possible reasons here: "}
              <Link
                href="https://support.opensea.io/hc/en-us/articles/7597082600211"
                colorScheme="blue"
                isExternal
              >
                https://support.opensea.io/hc/en-us/articles/7597082600211
              </Link>
            </Text>
          </>
        }
      />
    </>
  )
}

const PurchaseRequirementWrapper = () => (
  <GuildCheckoutProvider>
    <PurchaseRequirement />
  </GuildCheckoutProvider>
)

export default PurchaseRequirementWrapper
