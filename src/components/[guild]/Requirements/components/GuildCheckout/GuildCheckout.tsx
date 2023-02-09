import {
  ButtonGroup,
  Collapse,
  HStack,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import ErrorAlert from "components/common/ErrorAlert"
import { Modal } from "components/common/Modal"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { Chains, RPC } from "connectors"
import { ShoppingCartSimple } from "phosphor-react"
import {
  ALLOWED_GUILDS,
  PURCHASABLE_REQUIREMENT_TYPES,
  purchaseSupportedChains,
} from "utils/guildCheckout/constants"
import BlockExplorerUrl from "../BlockExplorerUrl"
import AlphaTag from "./components/AlphaTag"
import AllowanceButton from "./components/buttons/AllowanceButton"
import PurchaseButton from "./components/buttons/PurchaseButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"
import FeeAndTotal from "./components/FeeAndTotal"
import {
  GuildCheckoutProvider,
  useGuildCheckoutContext,
} from "./components/GuildCheckoutContex"
import InfoModal from "./components/InfoModal"
import PurchasedRequirementInfo from "./components/InfoModal/components/PurchasedRequirementInfo"
import PaymentCurrencyPicker from "./components/PaymentCurrencyPicker"
import TOSCheckbox from "./components/TOSCheckbox"
import usePrice from "./hooks/usePrice"

const GuildCheckout = (): JSX.Element => {
  const { account, chainId } = useWeb3React()
  const { requirement, isOpen, onOpen, onClose, isInfoModalOpen } =
    useGuildCheckoutContext()
  const { id } = useGuild()
  const { data: accessData, isLoading: isAccessLoading } = useAccess(
    requirement?.roleId
  )
  const satisfiesRequirement = accessData?.requirements?.find(
    (req) => req.requirementId === requirement.id
  )?.access

  const {
    data: { priceInUSD },
    isValidating,
    error,
  } = usePrice(RPC[requirement?.chain]?.nativeCurrency?.symbol)

  if (
    !isInfoModalOpen &&
    (!ALLOWED_GUILDS.includes(id) ||
      !account ||
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
            <HStack>
              <Text as="span">Buy requirement</Text>

              <AlphaTag />
            </HStack>
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
            <ButtonGroup size="sm" w="full" mb="8">
              <Button
                autoFocus={false}
                colorScheme="blue"
                variant="subtle"
                w="full"
                borderRadius="md"
                data-dd-action-name="Pay with crypto (GuildCheckout)"
              >
                Pay with crypto
              </Button>

              <Tooltip label="Coming soon" placement="top" hasArrow>
                <Button
                  autoFocus={false}
                  variant="subtle"
                  w="full"
                  borderRadius="md"
                  isDisabled
                  data-dd-action-name="Pay with card (GuildCheckout)"
                  _hover={""}
                >
                  Pay with card
                </Button>
              </Tooltip>
            </ButtonGroup>

            <Collapse
              in={!!error?.error}
              style={{
                width: "100%",
              }}
            >
              <ErrorAlert label={error?.error} />
            </Collapse>

            <Stack spacing={8} w="full">
              <PaymentCurrencyPicker />

              <FeeAndTotal />

              <Stack spacing={2}>
                {!error && (
                  <>
                    <Collapse in={chainId !== Chains[requirement.chain]}>
                      <SwitchNetworkButton />
                    </Collapse>
                    <Collapse in={chainId === Chains[requirement.chain]}>
                      <TOSCheckbox />
                      <AllowanceButton />
                    </Collapse>
                  </>
                )}
                <PurchaseButton />
              </Stack>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <InfoModal />
    </>
  )
}

const GuildCheckoutWrapper = (): JSX.Element => (
  <GuildCheckoutProvider>
    <GuildCheckout />
  </GuildCheckoutProvider>
)

export default GuildCheckoutWrapper
