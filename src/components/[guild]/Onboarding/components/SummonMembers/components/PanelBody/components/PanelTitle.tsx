import { Editable, EditableInput, EditablePreview, HStack } from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect } from "react"
import { useController } from "react-hook-form"
import EditableControls from "./EditableControls"

const PanelTitle = () => {
  const addDatadogAction = useRumAction("trackingAppAction")

  const { field, fieldState } = useController({
    name: "title",
    rules: { required: true },
  })

  const isDirty = useDebouncedState(fieldState.isDirty)

  useEffect(() => {
    if (!isDirty) return
    addDatadogAction("modified dc embed title")
  }, [isDirty])

  return (
    <Editable
      fontWeight={"bold"}
      {...field}
      placeholder={"Title"}
      color="#4EACEE"
      as={HStack}
      spacing={3}
    >
      <EditablePreview />
      <EditableInput marginInlineStart="0 !important" width="min" />
      <EditableControls />
    </Editable>
  )
}

export default PanelTitle
