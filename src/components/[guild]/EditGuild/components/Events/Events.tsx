import { SimpleGrid, Text } from "@chakra-ui/react"
import { supportedEventSources } from "types"
import EventInput from "./EventInput"

const Events = () => (
  <>
    <Text colorScheme="gray">
      Guild can auto-import your events from different platforms to show them in one
      place.
    </Text>
    <SimpleGrid columns={2} gap={3}>
      {supportedEventSources.map((provider) => (
        <EventInput key={provider} name={provider} />
      ))}
    </SimpleGrid>
  </>
)

export default Events
