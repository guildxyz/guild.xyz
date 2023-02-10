import { ButtonGroup, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"

const PaymentModeButtons = () => (
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
)

export default PaymentModeButtons
