import { ButtonProps } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { ArrowSquareOut } from "phosphor-react"
import { EventSourcesKey } from "types"

type Props = {
  eventName: string
  userCount: number
  guildId: number
  eventType: EventSourcesKey
  url: string
} & ButtonProps

const eventButtonColor: Record<EventSourcesKey, string> = {
  EVENTBRITE: "#f05537",
  LINK3: "#606060",
  LUMA: "#000000",
  DISCORD: "#5865f2",
}

const eventButtonText: Record<EventSourcesKey, string> = {
  EVENTBRITE: "Eventbrite",
  LINK3: "Link3",
  LUMA: "Lu.ma",
  DISCORD: "Discord",
}

const JoinDiscordEventButton = ({
  eventName,
  userCount,
  guildId,
  eventType,
  url,
  ...rest
}: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()

  return (
    <Button
      as="a"
      href={url}
      target="_blank"
      bg={eventButtonColor[eventType]}
      rightIcon={<ArrowSquareOut />}
      mt={3}
      color="white"
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
      {`Join ${eventButtonText[eventType] ?? ""} event`}
    </Button>
  )
}

export default JoinDiscordEventButton
