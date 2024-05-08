import { Icon, Img, SimpleGrid, Text } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { Plus } from "phosphor-react"
import { useFormContext, useWatch } from "react-hook-form"
import { EventSourcesKey, SelectOption } from "types"
import EventInput, { eventSourceNames, logos } from "./EventInput"

const EventProviders: EventSourcesKey[] = ["EVENTBRITE", "LINK3", "LUMA"]

const eventOptions: SelectOption<EventSourcesKey>[] = EventProviders.map(
  (eventProvider) => ({
    label: eventSourceNames[eventProvider],
    value: eventProvider,
    img: <Img boxSize={5} src={logos[eventProvider]} borderRadius={"full"} />,
  })
)

const Events = () => {
  const { control, setValue } = useFormContext()
  const definedEventProviders = useWatch({
    control: control,
    name: "eventSources",
  })

  return (
    <>
      <Text colorScheme="gray" mb="3">
        Guild can auto-import your events from different platforms to show them in
        one place.
      </Text>
      <SimpleGrid columns={2} gap={3}>
        {eventOptions.map((event) => (
          <EventInput key={event.value} eventSource={event.value} />
        ))}
        <StyledSelect
          options={eventOptions.filter(
            (option) => !definedEventProviders[option.value]
          )}
          onChange={(newValue: SelectOption<EventSourcesKey>) =>
            setValue(`eventSources.${newValue.value}`, "")
          }
          placeholder="Add more"
          value=""
          components={{
            DropdownIndicator: () => <Icon as={Plus} pr={2} boxSize={6} />,
          }}
          size="lg"
        />
      </SimpleGrid>
    </>
  )
}

export default Events
