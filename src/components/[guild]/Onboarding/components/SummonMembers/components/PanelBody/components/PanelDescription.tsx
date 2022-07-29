import {
  Editable,
  EditablePreview,
  EditableTextarea,
  HStack,
} from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect } from "react"
import { useController } from "react-hook-form"
import EditableControls from "./EditableControls"

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
    <Editable fontSize={"sm"} {...field} placeholder={"Description"} as={HStack}>
      <EditablePreview />
      <EditableTextarea m="0px !important" />
      <EditableControls />
    </Editable>
  )
}

export default PanelDescription
