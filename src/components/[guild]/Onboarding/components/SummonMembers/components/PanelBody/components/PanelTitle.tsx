import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react"
import { useController } from "react-hook-form"

const PanelTitle = () => {
  const { field } = useController({ name: "title" })

  return (
    <Editable fontWeight={"bold"} {...field} placeholder="Verify your wallet">
      <EditablePreview />
      <EditableInput />
    </Editable>
  )
}

export default PanelTitle
