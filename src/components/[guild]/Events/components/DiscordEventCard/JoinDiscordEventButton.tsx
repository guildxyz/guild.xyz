import { Button } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Link from "components/common/Link"
import { ArrowSquareOut } from "phosphor-react"

type Props = {
  eventName: string
  userCount: number
  guildId: number
  eventId: string
}

const JoinDiscordEventButton = ({
  eventName,
  userCount,
  guildId,
  eventId,
}: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()

  return (
    <Link
      href={`https://discord.com/events/${guildId}/${eventId}`}
      isExternal
      colorScheme="gray"
      fontWeight="medium"
      mt={3}
      onClick={(event) => {
        event.stopPropagation()
        captureEvent("Click on join event button", {
          eventType: "Discord",
          eventName,
          userCount,
          guildId,
        })
      }}
    >
      <Button colorScheme="indigo" rightIcon={<ArrowSquareOut />} size="sm">
        Join Discord event
      </Button>
    </Link>
  )
}

export default JoinDiscordEventButton
