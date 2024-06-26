import {
  Circle,
  CloseButton,
  FormControl,
  FormErrorMessage,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"
import { EventSourcesKey } from "types"
import { EditGuildForm } from "../../EditGuildDrawer"

type Props = {
  eventSource: EventSourcesKey
}

const eventSourceNames: Record<EventSourcesKey, string> = {
  EVENTBRITE: "Eventbrite",
  LINK3: "Link3",
  LUMA: "lu.ma",
  DISCORD: "Diiscord",
}

const logos: Record<EventSourcesKey, string> = {
  EVENTBRITE: "/platforms/eventbrite.png",
  LINK3: "/platforms/link3.png",
  LUMA: "/platforms/luma.png",
  DISCORD: "/platforms/discord.png",
}

const placeholders: Record<Exclude<EventSourcesKey, "DISCORD">, string> = {
  EVENTBRITE: "https://www.eventbrite.com/e/...",
  LUMA: "https://lu.ma/u/...",
  LINK3: "https://link3.to/e/...",
}

const validators: Record<
  Exclude<EventSourcesKey, "DISCORD">,
  (value?: string) => true | string
> = {
  EVENTBRITE: (url) => !!url.match(/(.)+eventbrite\.com\/e\/(.)+/) || "Invalid URL",
  LUMA: (url) => !!url.match(/(.)+lu\.ma\/u\/(.)+/) || "Invalid URL",
  LINK3: (url) => !!url.match(/(.)+link3\.to\/(.)+/) || "Invalid URL",
}

const EventInput = ({ eventSource }: Props) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<EditGuildForm>()

  const link = useWatch({
    name: `eventSources.${eventSource}`,
  })

  if (!link && link !== "") return null

  return (
    <FormControl isInvalid={!!errors?.eventSources?.[eventSource]} isRequired>
      <InputGroup size={"lg"}>
        <InputLeftElement>
          <Circle bgColor={"gray.900"} size={5}>
            <Img boxSize={5} src={logos[eventSource]} borderRadius={"full"} />
          </Circle>
        </InputLeftElement>
        <Input
          {...register(`eventSources.${eventSource}`, {
            required: "This field is required.",
            validate: validators[eventSource],
          })}
          size={"lg"}
          placeholder={placeholders[eventSource]}
        />
        <InputRightElement>
          <CloseButton
            aria-label="Remove link"
            size="sm"
            rounded="full"
            onClick={() =>
              setValue(`eventSources.${eventSource}`, undefined, {
                shouldDirty: true,
              })
            }
          />
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>
        {errors?.eventSources?.[eventSource]?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export { eventSourceNames, logos }
export default EventInput
