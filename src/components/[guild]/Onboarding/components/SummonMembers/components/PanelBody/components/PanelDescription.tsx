import { Editable, EditablePreview, EditableTextarea } from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect } from "react"
import { useController } from "react-hook-form"

const PanelDescription = () => {
  const addDatadogAction = useRumAction("trackingAppAction")

  const { field, fieldState } = useController({
    name: "description",
    rules: { required: true },
  })

  const isDirty = useDebouncedState(fieldState.isDirty)

  useEffect(() => {
    if (!isDirty) return
    addDatadogAction("modified dc embed description")
  }, [isDirty])

  return (
    <Editable fontSize={"sm"} {...field} placeholder={"Description"}>
      <EditablePreview />
      <EditableTextarea />
    </Editable>
  )
}

export default PanelDescription
