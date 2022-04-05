import { CloseButton, Collapse, Text } from "@chakra-ui/react"
import ModalButton from "components/common/ModalButton"
import useGuild from "components/[guild]/hooks/useGuild"
import { Check } from "phosphor-react"
import { useState } from "react"
import { OAuthParams } from "../hooks/useDCAuth"

type Props = {
  id: string
  error: any
  onOpen: (url: OAuthParams) => void
  isAuthenticating: boolean
}

const DCAuthButton = ({ id, error, onOpen, isAuthenticating }: Props) => {
  const [shouldShowNotification, setShouldShowNotification] = useState(true)
  const guild = useGuild()

  const onPopupOpen = () =>
    onOpen({ scope: ["identify"], state: { urlName: guild?.urlName } })

  if (id?.length > 0) {
    return (
      <Collapse in={shouldShowNotification} unmountOnExit>
        <ModalButton
          mb="3"
          as="div"
          colorScheme="gray"
          variant="solidStatic"
          rightIcon={
            <CloseButton onClick={() => setShouldShowNotification(false)} />
          }
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
  }

  return (
    <ModalButton
      mb="3"
      onClick={onPopupOpen}
      isLoading={isAuthenticating}
      loadingText="Confirm in the pop-up"
    >
      {error ? "Try again" : "Connect Discord"}
    </ModalButton>
  )
}

export default DCAuthButton
