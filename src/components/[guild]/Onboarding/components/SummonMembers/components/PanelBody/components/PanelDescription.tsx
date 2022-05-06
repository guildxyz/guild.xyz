import { Editable, EditablePreview, EditableTextarea } from "@chakra-ui/react"
import { useController } from "react-hook-form"

const PanelDescription = () => {
  const { field } = useController({ name: "description", rules: { required: true } })

  return (
    <Editable fontSize={"sm"} {...field} placeholder={"Description"}>
      <EditablePreview />
      <EditableTextarea />
    </Editable>
  )
}

export default PanelDescription
