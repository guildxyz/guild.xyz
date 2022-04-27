import { Box, Editable, EditableInput, EditablePreview } from "@chakra-ui/react"
import { useController } from "react-hook-form"

const PanelButton = () => {
  const { field } = useController({ name: "button", rules: { required: true } })

  return (
    <Box bg="DISCORD.500" py="1" px="4" borderRadius={"4px"} d="inline-block" mt="2">
      <Editable
        fontSize={"sm"}
        fontWeight="semibold"
        placeholder={"Button label"}
        {...field}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </Box>
  )
}

export default PanelButton
