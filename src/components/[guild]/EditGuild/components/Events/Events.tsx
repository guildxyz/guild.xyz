import { SimpleGrid, Text } from "@chakra-ui/react"
import EventInput from "./EventInput"

const Events = () => (
  <>
    <Text colorScheme="gray">
      Guild can auto-import your events from different platforms to show them in one
      place.
    </Text>
    <SimpleGrid columns={2} gap={3}>
      <EventInput eventSource={"EVENTBRITE"} />
      <EventInput eventSource={"LUMA"} />
      <EventInput eventSource={"LINK3"} />
    </SimpleGrid>
  </>
)

export default Events
