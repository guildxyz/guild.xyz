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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stack,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ErrorAlert from "components/common/ErrorAlert"
import { Modal } from "components/common/Modal"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { useIntercom } from "components/_app/IntercomProvider"
import { RPC } from "connectors"
import { ArrowSquareOut, ShoppingCartSimple } from "phosphor-react"
import {
  ALLOWED_GUILDS,
  PURCHASABLE_REQUIREMENT_TYPES,
  purchaseSupportedChains,
} from "utils/guildCheckout/constants"
import BlockExplorerUrl from "../BlockExplorerUrl"
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
  const { triggerChat } = useIntercom()

  const { account } = useWeb3React()
  const { requirement, isOpen, onOpen, onClose, pickedCurrency } =
    useGuildCheckoutContext()
  const { id } = useGuild()
  const { data: accessData, isLoading: isAccessLoading } = useAccess(
    requirement?.roleId
  )
  const satisfiesRequirement = accessData?.requirements?.find(
    (req) => req.requirementId === requirement.id
  )?.access

  const modalFooterBg = useColorModeValue("gray.100", "gray.800")

  const {
    data: { priceInUSD },
    isValidating,
    error,
  } = usePrice("ETH" ?? RPC[requirement?.chain]?.nativeCurrency?.symbol)

  if (
    !ALLOWED_GUILDS.includes(id) ||
    !account ||
    (!isOpen && satisfiesRequirement) ||
    (!accessData && isAccessLoading) ||
    !PURCHASABLE_REQUIREMENT_TYPES.includes(requirement?.type) ||
    !purchaseSupportedChains[requirement?.type]?.includes(requirement?.chain)
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text as="span">Buy requirement</Text>

              <Popover trigger="hover">
                <PopoverTrigger>
                  <Tag size="sm" position="relative" top={0.5} fontFamily="body">
                    Alpha
                  </Tag>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody fontFamily="body" fontSize="sm" fontWeight="normal">
                    {
                      "This product is still in alpha. If you run into any issue please let us know in our "
                    }
                    <Button variant="link" size="sm" onClick={triggerChat}>
                      <HStack spacing={1}>
                        <Text as="span">help center</Text>
                        <Icon as={ArrowSquareOut} />
                      </HStack>
                    </Button>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
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

          <ModalFooter pt={10} bgColor={modalFooterBg} flexDir="column">
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
                >
                  Pay with card
                </Button>
              </Tooltip>
            </ButtonGroup>

            <Collapse
              in={!!error}
              style={{
                width: "100%",
              }}
            >
              <ErrorAlert label={error?.error} />
            </Collapse>

            <Stack spacing={8} w="full">
              <PaymentCurrencyPicker />

              <FeeAndTotal />

              <Stack spacing={3}>
                {!pickedCurrency ? (
                  <CardMotionWrapper>
                    <Button size="xl" isDisabled w="full">
                      Choose currency
                    </Button>
                  </CardMotionWrapper>
                ) : (
                  <>
                    <SwitchNetworkButton />
                    <TOSCheckbox />
                    <AllowanceButton />
                    <PurchaseButton />
                  </>
                )}
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
