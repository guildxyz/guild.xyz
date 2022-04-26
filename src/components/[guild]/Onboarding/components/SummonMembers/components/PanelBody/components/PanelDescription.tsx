import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react"
import { useController } from "react-hook-form"
import { getFallbackMessageValues } from "../../../SummonMembers"

const PanelDescription = () => {
  const { field } = useController({ name: "description" })

  const placeholder = getFallbackMessageValues().description

  return (
    <Editable fontSize={"sm"} {...field} placeholder={placeholder}>
      <EditablePreview />
      <EditableInput />
    </Editable>
  )
}

export default PanelDescription
