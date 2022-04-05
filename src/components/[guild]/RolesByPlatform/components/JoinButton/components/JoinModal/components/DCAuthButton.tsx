import { CloseButton, Collapse, Text } from "@chakra-ui/react"
import ModalButton from "components/common/ModalButton"
import useGuild from "components/[guild]/hooks/useGuild"
import { Check } from "phosphor-react"

type Props = {
  id: string
  onOpen: (url: string) => void
  isAuthenticating: boolean
  hideDCAuthNotification: boolean
  setHideDCAuthNotification: (_) => void
}

const DCAuthButton = ({
  id,
  onOpen,
  isAuthenticating,
  hideDCAuthNotification,
  setHideDCAuthNotification,
}: Props) => {
  const guild = useGuild()

  const onPopupOpen = () =>
    onOpen(
      `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&response_type=token&scope=identify&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI}&state=${guild?.urlName}`
    )

  if (id?.length > 0) {
    return (
      <Collapse in={!hideDCAuthNotification} unmountOnExit>
        <ModalButton
          mb="3"
          as="div"
          colorScheme="gray"
          variant="solidStatic"
          rightIcon={<CloseButton onClick={() => setHideDCAuthNotification(true)} />}
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
      Connect Discord
    </ModalButton>
  )
}

export default DCAuthButton
