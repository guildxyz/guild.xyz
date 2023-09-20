import { FormLabel, Input, VStack } from "@chakra-ui/react"
import { ChangeEventHandler, useState } from "react"

type Props = {
  link: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

const EventLinkInput = ({ link, onChange }: Props): JSX.Element => {
  const [edit, toggle] = useState(true)

  return (
    <VStack w={"full"} alignItems={"flex-start"}>
      <FormLabel>Link3</FormLabel>
      <Input
        size="lg"
        value={link}
        onChange={onChange}
        placeholder="https://link3.to/..."
      />
    </VStack>
  )
}

export default EventLinkInput
