import { ButtonProps } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import useColorPalette from "hooks/useColorPalette"
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
  LINK3: "#586079",
  LUMA: "#ff5385",
  DISCORD: "#5865f2",
}

const eventButtonText: Record<EventSourcesKey, string> = {
  EVENTBRITE: "Eventbrite",
  LINK3: "Link3",
  LUMA: "Lu.ma",
  DISCORD: "Discord",
}

const JoinEventButton = ({
  eventName,
  userCount,
  guildId,
  eventType,
  url,
  ...rest
}: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()

  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    eventButtonColor[eventType]
  )

  return (
    <Button
      as="a"
      href={url}
      target="_blank"
      rightIcon={<ArrowSquareOut />}
      mt={3}
      colorScheme="primary"
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
      sx={{
        ...generatedColors,
      }}
      {...rest}
    >
      {`Join ${eventButtonText[eventType] ?? ""} event`}
    </Button>
  )
}

export default JoinEventButton
