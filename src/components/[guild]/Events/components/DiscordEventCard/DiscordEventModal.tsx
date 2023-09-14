import { Heading, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import { DiscordEvent } from "hooks/useDiscordEvent"
import EventImage from "./EventImage"
import EventInfo from "./EventInfo"
import JoinDiscordEventButton from "./JoinDiscordEventButton"

type Props = {
  event: DiscordEvent
  guildId: number
}

const DiscordEventModal = ({
  event: { name, description, image, scheduledStartTimestamp, userCount, id },
  guildId,
}: Props): JSX.Element => (
  <Card flexDirection="column" gap={5} flexGrow="1" p={5}>
    <EventImage eventId={id} image={image} showFallback={false} />
    <Heading fontSize={"xl"} fontFamily={"Dystopian"} fontWeight={"bold"} mb={-1}>
      {name}
    </Heading>
    <EventInfo userCount={userCount} startDate={scheduledStartTimestamp} />
    {description && (
      <Text fontSize={"sm"} flexGrow={1}>
        {description}
      </Text>
    )}
    <JoinDiscordEventButton
      eventName={name}
      guildId={guildId}
      userCount={userCount}
      eventId={id}
    />
  </Card>
)

export default DiscordEventModal
