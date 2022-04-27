import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react"
import { useController } from "react-hook-form"

const PanelTitle = () => {
  const { field } = useController({ name: "title", rules: { required: true } })

  return (
    <Editable fontWeight={"bold"} {...field} placeholder={"Title"}>
      <EditablePreview />
      <EditableInput />
    </Editable>
  )
}

export default PanelTitle
