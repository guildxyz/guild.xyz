import {
  ButtonGroup,
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
  useColorModeValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useAccess from "components/[guild]/hooks/useAccess"
import { RPC } from "connectors"
import { ShoppingCartSimple } from "phosphor-react"
import {
  PURCHASABLE_REQUIREMENT_TYPES,
  purchaseSupportedChains,
} from "utils/guildCheckout"
import RequirementDisplayComponent from "../RequirementDisplayComponent"
import AllowanceButton from "./components/buttons/AllowanceButton"
import ChooseCurrencyButton from "./components/buttons/ChooseCurrencyButton"
import PurchaseButton from "./components/buttons/PurchaseButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"
import FeeAndTotal from "./components/FeeAndTotal"
import {
  GuildCheckoutProvider,
  useGuildCheckoutContext,
} from "./components/GuildCheckoutContex"
import InfoModal from "./components/InfoModal"
import PaymentCurrencyPicker from "./components/PaymentCurrencyPicker"
import TOSCheckbox from "./components/TOSCheckbox"
import usePrice from "./hooks/usePrice"

const GuildCheckout = (): JSX.Element => {
  const { account } = useWeb3React()
  const { requirement, isOpen, onOpen, onClose, pickedCurrency } =
    useGuildCheckoutContext()
  const { data: accessData } = useAccess(requirement?.roleId)
  const satisfiesRequirement =
    requirement &&
    accessData &&
    accessData.requirements?.find((req) => req.requirementId === requirement.id)
      .access

  const modalFooterBg = useColorModeValue("gray.100", "gray.800")

  const {
    data: priceData,
    isValidating,
    error,
  } = usePrice(requirement?.chain && RPC[requirement.chain].nativeCurrency.symbol)

  if (
    !account ||
    satisfiesRequirement ||
    !PURCHASABLE_REQUIREMENT_TYPES.includes(requirement?.type) ||
    !purchaseSupportedChains[requirement.type].includes(requirement.chain)
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
      >
        Purchase
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Buy requirement</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <RequirementDisplayComponent
              requirement={requirement}
              showPurchaseBtn={false}
              rightElement={
                isValidating ? (
                  <Spinner size="sm" />
                ) : (
                  <Text as="span">
                    {isNaN(priceData?.priceInUSD)
                      ? "-"
                      : `$${priceData.priceInUSD.toFixed(0)}`}
                  </Text>
                )
              }
            />
          </ModalBody>

          <ModalFooter pt={10} bgColor={modalFooterBg}>
            {error ? (
              <Text w="full" colorScheme="gray">
                {error.error}
              </Text>
            ) : (
              <Stack spacing={8} w="full">
                <ButtonGroup size="sm" w="full">
                  <Button
                    autoFocus={false}
                    colorScheme="blue"
                    variant="subtle"
                    w="full"
                    borderRadius="md"
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
                    >
                      Pay with card
                    </Button>
                  </Tooltip>
                </ButtonGroup>

                <PaymentCurrencyPicker />

                <FeeAndTotal />

                <Stack spacing={3}>
                  {!pickedCurrency ? (
                    <ChooseCurrencyButton />
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
            )}
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
