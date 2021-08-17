import { CloseButton, Collapse, Text } from "@chakra-ui/react"
import ModalButton from "components/common/ModalButton"
import { Check } from "phosphor-react"
import { State } from "xstate"
import type { ContextType } from "../hooks/useDCAuthMachine"

type Props = {
  state: State<ContextType>
  send: (event: string) => State<ContextType>
}

const DCAuthButton = ({ state, send }: Props) => {
  switch (state.value) {
    case "checkIsMember":
      return <ModalButton mb="3" isLoading loadingText="Checking Discord data" />
    case "checkIsMemberError":
      return (
        <ModalButton mb="3" onClick={() => send("RESET")}>
          Retry
        </ModalButton>
      )
    case "idKnown":
    case "successNotification":
      return (
        <Collapse in={state.matches("successNotification")} unmountOnExit>
          <ModalButton
            mb="3"
            as="div"
            colorScheme="gray"
            variant="solidStatic"
            rightIcon={<CloseButton onClick={() => send("HIDE_NOTIFICATION")} />}
            leftIcon={<Check />}
            justifyContent="space-between"
            px="4"
          >
            <Text title="Authentication successful" isTruncated>
              Authentication successful
            </Text>
          </ModalButton>
        </Collapse>
      )
    case "authenticating":
      return (
        <ModalButton mb="3" isLoading loadingText="Waiting for authentication" />
      )
    case "idle":
    case "error":
    default:
      return (
        <ModalButton mb="3" onClick={() => send("AUTH")}>
          Connect Discord
        </ModalButton>
      )
  }
}

export default DCAuthButton
