import {
  CloseButton,
  Collapse,
  Icon,
  Text,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react"
import ModalButton from "components/common/ModalButton"
import { Check, Info } from "phosphor-react"

const TokenAllowance = ({ state, send, tokenSymbol, successText }) => {
  const waitingForTransactionText = useBreakpointValue({
    base: "Waiting for transaction",
    sm: "Waiting for transaction to succeed",
  })

  switch (state.value) {
    case "noAllowance":
    case "error":
      return (
        <ModalButton
          mb="3"
          rightIcon={
            <Tooltip
              label={`You have to give the Agora smart contracts permission to use your ${tokenSymbol}. You only have to do this once per token.`}
              placement="top"
            >
              <Icon as={Info} tabIndex={0} />
            </Tooltip>
          }
          // so the button label will be positioned to the center
          leftIcon={<span />}
          justifyContent="space-between"
          onClick={() => send("ALLOW")}
        >
          {`Allow Agora to use ${tokenSymbol}`}
        </ModalButton>
      )
    case "waitingConfirmation":
      return <ModalButton mb="3" isLoading loadingText="Waiting confirmation" />
    case "waitingForTransaction":
      return <ModalButton mb="3" isLoading loadingText={waitingForTransactionText} />
    case "successNotification":
    case "allowanceGranted":
    default:
      return (
        <Collapse in={state.matches("successNotification")} unmountOnExit>
          <ModalButton
            as="div"
            colorScheme="gray"
            variant="solidStatic"
            rightIcon={<CloseButton onClick={() => send("HIDE_NOTIFICATION")} />}
            leftIcon={<Check />}
            justifyContent="space-between"
            mb="3"
            px="4"
          >
            <Text title={successText} isTruncated>
              {successText}
            </Text>
          </ModalButton>
        </Collapse>
      )
  }
}

export default TokenAllowance
