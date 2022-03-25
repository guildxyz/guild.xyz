import ModalButton from "components/common/ModalButton"
import useGuild from "components/[guild]/hooks/useGuild"
import { useState } from "react"

type Props = {
  onOpen: (url: string) => void
}

const DCAuthButton = ({ onOpen }: Props) => {
  const [shouldShowNotification, setShouldShowNotification] = useState(true)
  const guild = useGuild()

  /* if (id?.length > 0) {
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

  if (isAuthenticating) {
    return <ModalButton mb="3" isLoading loadingText="Confirm in the pop-up" />
  }*/

  return (
    <ModalButton
      mb="3"
      onClick={() =>
        onOpen(
          `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&response_type=token&scope=identify&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI}&state=${guild?.urlName}`
        )
      }
    >
      "Connect Discord"
    </ModalButton>
  )
}

export default DCAuthButton
