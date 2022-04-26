import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react"
import { useController } from "react-hook-form"
import { getFallbackMessageValues } from "../../../SummonMembers"

const PanelTitle = () => {
  const { field } = useController({ name: "title" })

  const placeholder = getFallbackMessageValues().title

  return (
    <Editable fontWeight={"bold"} {...field} placeholder={placeholder}>
      <EditablePreview />
      <EditableInput />
    </Editable>
  )
}

export default PanelTitle
