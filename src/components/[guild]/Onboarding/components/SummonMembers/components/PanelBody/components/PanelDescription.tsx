import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react"
import { useController } from "react-hook-form"

const PanelDescription = () => {
  const { field } = useController({ name: "description" })

  return (
    <Editable
      fontSize={"sm"}
      {...field}
      placeholder="Join this guild and get your role(s)!"
    >
      <EditablePreview />
      <EditableInput />
    </Editable>
  )
}

export default PanelDescription
