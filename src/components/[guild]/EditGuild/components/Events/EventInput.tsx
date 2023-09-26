import { Circle, Img, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { EventSourcesKey, GuildFormType } from "types"

type Props = {
  name: EventSourcesKey
}

const placeholders: Record<EventSourcesKey, string> = {
  EVENTBRITE: "Eventbrite",
  LINK3: "Link3",
  LUMA: "lu.ma",
  DISCORD: "Diiscord",
}

const logos: Record<EventSourcesKey, string> = {
  EVENTBRITE: "/platforms/eventbrite.png",
  LINK3: "/platforms/link3.png",
  LUMA: "/platforms/luma.png",
  DISCORD: "platforms/discord.png",
}

const EventInput = ({ name }: Props) => {
  const { register } = useFormContext<GuildFormType>()

  return (
    <InputGroup size={"lg"}>
      <InputLeftElement>
        <Circle bgColor={"gray.900"} size={5}>
          <Img boxSize={5} src={logos[name]} borderRadius={"full"} />
        </Circle>
      </InputLeftElement>
      <Input
        {...register(`eventSources.${name}`)}
        size={"lg"}
        placeholder={placeholders[name]}
      />
    </InputGroup>
  )
}

export default EventInput
