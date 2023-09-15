import Button from "components/common/Button"
import { usePostHogContext } from "components/_app/PostHogProvider"
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
    <Button
      as="a"
      href={`https://discord.com/events/${guildId}/${eventId}`}
      target="_blank"
      colorScheme="indigo"
      rightIcon={<ArrowSquareOut />}
      size="sm"
      mt={3}
      onClick={(event) => {
        // event.stopPropagation() ?????
        captureEvent("Click on join event button", {
          eventType: "Discord",
          eventName,
          userCount,
          guildId,
        })
      }}
    >
      Join Discord event
    </Button>
  )
}

export default JoinDiscordEventButton
