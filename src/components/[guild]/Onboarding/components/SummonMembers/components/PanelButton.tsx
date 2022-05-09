import { Box, Editable, EditableInput, EditablePreview } from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect } from "react"
import { useController } from "react-hook-form"

const PanelButton = () => {
  const addDatadogAction = useRumAction("trackingAppAction")

  const { field, fieldState } = useController({
    name: "button",
    rules: { required: true },
  })

  const isDirty = useDebouncedState(fieldState.isDirty)

  useEffect(() => {
    if (!isDirty) return
    addDatadogAction("modified dc embed button")
  }, [isDirty])

  return (
    <Box bg="DISCORD.500" py="1" px="4" borderRadius={"4px"} d="inline-block" mt="2">
      <Editable
        fontSize={"sm"}
        color="white"
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
