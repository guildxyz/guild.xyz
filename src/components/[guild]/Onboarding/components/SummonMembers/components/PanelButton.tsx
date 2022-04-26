import { Box, Editable, EditableInput, EditablePreview } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useController } from "react-hook-form"
import { getFallbackMessageValues } from "../SummonMembers"

const PanelButton = () => {
  const { field } = useController({ name: "button" })
  const { name } = useGuild()

  const placeholder = getFallbackMessageValues(name).button

  return (
    <Box bg="DISCORD.500" py="1" px="4" borderRadius={"4px"} d="inline-block" mt="2">
      <Editable
        fontSize={"sm"}
        fontWeight="semibold"
        placeholder={placeholder}
        {...field}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </Box>
  )
}

export default PanelButton
