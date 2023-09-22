import { ButtonProps } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { ArrowSquareOut } from "phosphor-react"

type Props = {
  eventName: string
  userCount: number
  guildId: number
  eventId: string
} & ButtonProps

const JoinDiscordEventButton = ({
  eventName,
  userCount,
  guildId,
  eventId,
  ...rest
}: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()

  return (
    <Button
      as="a"
      href={`https://discord.com/events/${guildId}/${eventId}`}
      target="_blank"
      colorScheme="indigo"
      rightIcon={<ArrowSquareOut />}
      mt={3}
      onClick={(event) => {
        // TODO: for some reason, LinkBox didn't work, so we ended up using `stopPropagation` here
        event.stopPropagation()
        captureEvent("Click on join event button", {
          eventType: "Discord",
          eventName,
          userCount,
          guildId,
        })
      }}
      {...rest}
    >
      Join Discord event
    </Button>
  )
}

export default JoinDiscordEventButton
