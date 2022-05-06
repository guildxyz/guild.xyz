import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect } from "react"
import { useController } from "react-hook-form"

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
    <Editable fontWeight={"bold"} {...field} placeholder={"Title"}>
      <EditablePreview />
      <EditableInput />
    </Editable>
  )
}

export default PanelTitle
