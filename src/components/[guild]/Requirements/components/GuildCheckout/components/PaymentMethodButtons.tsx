import { Box, ButtonGroup, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"

const PaymentMethodButtons = () => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const onPayWithCryptoClick = () =>
    captureEvent("Click: Pay with crypto (GuildCheckout)", {
      guild: urlName,
    })

  const onPayWithCardClick = () =>
    captureEvent("Click: Pay with card (GuildCheckout)", {
      guild: urlName,
    })

  return (
    <ButtonGroup size="sm" w="full" mb="8">
      <Button
        autoFocus={false}
        colorScheme="blue"
        variant="subtle"
        w="full"
        borderRadius="md"
        data-dd-action-name="Pay with crypto (GuildCheckout)"
        onClick={onPayWithCryptoClick}
      >
        Pay with crypto
      </Button>

      <Tooltip label="Coming soon" placement="top" hasArrow>
        <Box w="full" onClick={onPayWithCardClick}>
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
        </Box>
      </Tooltip>
    </ButtonGroup>
  )
}

export default PaymentMethodButtons
