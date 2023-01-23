import {
  ButtonGroup,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { ShoppingCartSimple } from "phosphor-react"
import { PURCHASABLE_REQUIREMENT_TYPES } from "utils/guildCheckout"
import RequirementDisplayComponent from "../RequirementDisplayComponent"
import AllowanceButton from "./components/buttons/AllowanceButton"
import ChooseCurrencyButton from "./components/buttons/ChooseCurrencyButton"
import PurchaseButton from "./components/buttons/PurchaseButton"
import SwitchNetworkButton from "./components/buttons/SwitchNetworkButton"
import FeeAndTotal from "./components/FeeAndTotal"
import PaymentCurrencyPicker from "./components/PaymentCurrencyPicker"
import {
  PurchaseRequirementProvider,
  usePurchaseRequirementContext,
} from "./components/PurchaseRequirementContex"

const PurchaseRequirement = (): JSX.Element => {
  const { account } = useWeb3React()
  const { requirement, isOpen, onOpen, onClose, pickedCurrency } =
    usePurchaseRequirementContext()

  const modalFooterBg = useColorModeValue("gray.50", "gray.800")

  if (!account || !PURCHASABLE_REQUIREMENT_TYPES.includes(requirement?.type))
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
          <ModalBody>
            <RequirementDisplayComponent
              requirement={requirement}
              showPurchaseBtn={false}
              showRightElement={false}
            />
          </ModalBody>

          <ModalFooter pt={10} bgColor={modalFooterBg}>
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
                    <AllowanceButton />
                    <PurchaseButton />
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

const PurchaseRequirementWrapper = (): JSX.Element => (
  <PurchaseRequirementProvider>
    <PurchaseRequirement />
  </PurchaseRequirementProvider>
)

export default PurchaseRequirementWrapper
