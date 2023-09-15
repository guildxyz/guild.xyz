import { Box, Collapse, Heading, Text, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { DiscordEvent } from "hooks/useDiscordEvents"
import EventImage from "./EventImage"
import EventInfo from "./EventInfo"
import JoinDiscordEventButton from "./JoinDiscordEventButton"

type Props = {
  event: DiscordEvent
  guildId: number
}

const DiscordEventCard = ({
  event: { name, description, image, scheduledStartTimestamp, userCount, id },
  guildId,
}: Props): JSX.Element => (
  <Card
    flexDirection={{ base: "column-reverse", md: "row" }}
    cursor="pointer"
    gap={5}
    flexGrow="1"
    p={5}
  >
    <VStack alignItems={"flex-start"} flex={"1"} gap={4}>
      <Heading fontSize={"xl"} fontFamily={"Dystopian"} fontWeight={"bold"} mb={-1}>
        {name}
      </Heading>
      <EventInfo userCount={userCount} startDate={scheduledStartTimestamp} />
      {description && (
        <Box>
          <Collapse startingHeight={"40px"} in={false}>
            <Text fontSize={"sm"} flexGrow={1}>
              {description}
            </Text>
          </Collapse>
        </Box>
      )}
      <JoinDiscordEventButton
        eventName={name}
        guildId={guildId}
        userCount={userCount}
        eventId={id}
      />
    </VStack>
    <EventImage eventId={id} image={image} />
  </Card>
)

export default DiscordEventCard
