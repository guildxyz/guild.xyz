import {
  Divider,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Switch from "components/common/Switch"
import { Trash } from "phosphor-react"
import { useForm, useWatch } from "react-hook-form"
import { PlatformType } from "types"

const EventManager = (): JSX.Element => {
  const apiRes = {
    eventBrite: "https://www.eventbrite.com/o/an-org-3232",
    link3: "",
  }
  const { guildPlatforms } = useGuild()

  const discordServers =
    guildPlatforms
      ?.filter((guildPlatform) => guildPlatform.platformId === PlatformType.DISCORD)
      .map((data) => data.platformGuildName) ?? []

  const { register } = useForm({
    defaultValues: {
      DISCORD: true,
      EVENTBRITE: "",
    },
  })
  const eventbrite = useWatch({ name: "EVENTBRITE" })

  return (
    <VStack gap={6} alignItems="flex-start">
      <Text colorScheme="gray">
        You can show events from external sources by giving the page link where all
        the events are displayed.
      </Text>
      <VStack w={"full"} alignItems={"flex-start"}>
        <FormLabel mb={0}>Discord</FormLabel>
        <Switch title={discordServers.join(", ")} {...register("DISCORD")} />
      </VStack>
      <VStack w={"full"} alignItems={"flex-start"}>
        <FormLabel mb={0}>Eventbrite</FormLabel>
        {apiRes.eventBrite ? (
          <>
            <HStack justifyContent="space-between" w="full">
              <Text colorScheme="gray">{apiRes.eventBrite}</Text>
              <IconButton
                aria-label="disconnect"
                colorScheme="red"
                variant={"ghost"}
                isRound
                w={10}
                h={10}
                icon={<Icon as={Trash} />}
              />
            </HStack>
            <Divider />
          </>
        ) : (
          <Input
            size="lg"
            py={2}
            {...register("EVENTBRITE")}
            placeholder="https://www.eventbrite.com/o/..."
          />
        )}
      </VStack>
      <VStack w={"full"} alignItems={"flex-start"}>
        <FormLabel mb={0}>Link3</FormLabel>
        <Input
          size="lg"
          {...register("EVENTBRITE")}
          placeholder="https://link3.to/..."
        />
      </VStack>
    </VStack>
  )
}

export default EventManager
