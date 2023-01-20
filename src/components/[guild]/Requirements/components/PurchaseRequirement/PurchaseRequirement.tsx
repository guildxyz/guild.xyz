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
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { ShoppingCartSimple } from "phosphor-react"
import { useRequirementContext } from "../RequirementContext"
import RequirementDisplayComponent from "../RequirementDisplayComponent"
import FeeAndTotal from "./components/FeeAndTotal"
import PaymentCurrencyPicker from "./components/PaymentCurrencyPicker"

const PurchaseRequirement = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const modalFooterBg = useColorModeValue("gray.50", "gray.800")

  const requirement = useRequirementContext()

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

              {/* TODO: total/fee  */}

              <Stack spacing={3}>
                <Button size="xl" colorScheme="blue" loadingText="Check your wallet">
                  Purchase
                </Button>
                <Button size="xl" isDisabled>
                  Disabled action
                </Button>
              </Stack>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default PurchaseRequirement
