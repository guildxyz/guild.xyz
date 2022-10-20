import {
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react"
import useDatadog from "components/_app/Datadog/useDatadog"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect } from "react"
import { useController } from "react-hook-form"
import EditableControls from "./EditableControls"

const PanelTitle = () => {
  const { addDatadogAction } = useDatadog()

  const color = useColorModeValue("#2a66d8", "#4EACEE")

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
      color={color}
      as={HStack}
    >
      <EditablePreview />
      <EditableInput marginInlineStart="0 !important" width="min" />
      <EditableControls />
    </Editable>
  )
}

export default PanelTitle
