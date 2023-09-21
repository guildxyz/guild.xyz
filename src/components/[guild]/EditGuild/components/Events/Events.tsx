import {
  Icon,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Switch,
  Text,
} from "@chakra-ui/react"
import EventProviderIcon from "components/[guild]/EventProviderIcons"
import useGuild from "components/[guild]/hooks/useGuild"
import StyledSelect from "components/common/StyledSelect"
import { Plus } from "phosphor-react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import {
  EventProviderKey,
  EventsFormType,
  PlatformType,
  SelectOption,
  supportedEventProviders,
} from "types"
import capitalize from "utils/capitalize"
import EventInput from "./EventInput"

const eventOptions: SelectOption<EventProviderKey>[] = supportedEventProviders.map(
  (eventProvider) => ({
    label: capitalize(eventProvider.toLowerCase()),
    value: eventProvider,
    img: <EventProviderIcon type={eventProvider} size="sm" />,
  })
)

const Events = () => {
  const methods = useForm<EventsFormType>({
    defaultValues: {
      eventProviders: {
        EVENTBRITE: {
          link: "https://www.eventbrite.com/o/richard-simcott-31421087683",
          isEnabled: true,
        },
        LINK3: {
          link: "https://www.eventbrite.com/o/richard-simcott-31421087683",
          isEnabled: false,
        },
        LUMA: {
          link: null,
          isEnabled: false,
        },
      },
    },
  })

  const { guildPlatforms } = useGuild()

  const discordServers =
    guildPlatforms
      ?.filter((guildPlatform) => guildPlatform.platformId === PlatformType.DISCORD)
      .map((data) => data.platformGuildName) ?? []

  const definedEventProviders = useWatch({
    control: methods.control,
    name: "eventProviders",
  })

  return (
    <>
      <Text colorScheme="gray">
        Guild can auto-import your events from different platforms to show them in
        one place.
      </Text>
      <FormProvider {...methods}>
        <SimpleGrid columns={2} gap={3}>
          <InputGroup size={"lg"}>
            <InputLeftElement>
              <Img
                boxSize={5}
                src={"/platforms/discord.png"}
                borderRadius={"full"}
              />
            </InputLeftElement>
            <Input value={discordServers.join(", ")} isDisabled />
            <InputRightElement>
              <Switch size={"sm"} />
            </InputRightElement>
          </InputGroup>
          {eventOptions.map((event) => (
            <EventInput
              key={event.name}
              name={event.value}
              logo={event.img as JSX.Element}
            />
          ))}
          <StyledSelect
            options={eventOptions.filter(
              (option) => null === definedEventProviders[option.value].link
            )}
            onChange={(newValue: SelectOption<EventProviderKey>) =>
              methods.setValue(`eventProviders.${newValue.value}.link`, "")
            }
            placeholder="Add more"
            value=""
            components={{
              DropdownIndicator: () => <Icon as={Plus} pr={2} boxSize={6} />,
            }}
            size="lg"
          />
        </SimpleGrid>
      </FormProvider>
    </>
  )
}

export default Events
