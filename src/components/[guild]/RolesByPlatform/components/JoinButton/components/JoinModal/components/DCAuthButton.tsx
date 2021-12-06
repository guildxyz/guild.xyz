import { CloseButton, Collapse, Text } from "@chakra-ui/react"
import ModalButton from "components/common/ModalButton"
import { Check } from "phosphor-react"
import { State } from "xstate"
import { ContextType } from "../hooks/useDCAuthMachine/useDCAuthMachine"

type Props = {
  state: State<ContextType>
  send: (event: string) => State<ContextType>
}

const DCAuthButton = ({ state, send }: Props) => {
  switch (true) {
    case state.matches("checkIsMember"):
      return <ModalButton mb="3" isLoading loadingText="Checking Discord data" />
    case state.matches("checkIsMemberError"):
      return (
        <ModalButton mb="3" onClick={() => send("RESET")}>
          Retry
        </ModalButton>
      )
    case state.matches("idKnown"):
      return (
        <Collapse
          in={state.matches({ idKnown: "successNotification" })}
          unmountOnExit
        >
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
    case state.matches("authenticating"):
      return <ModalButton mb="3" isLoading loadingText="Confirm in the pop-up" />
    case state.matches("idle"):
    case state.matches("error"):
    default:
      return (
        <ModalButton mb="3" onClick={() => send("AUTH")}>
          Connect Discord
        </ModalButton>
      )
  }
}

export default DCAuthButton
