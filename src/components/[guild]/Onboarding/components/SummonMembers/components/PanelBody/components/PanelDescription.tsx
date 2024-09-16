import {
  Editable,
  EditablePreview,
  EditableTextarea,
  HStack,
} from "@chakra-ui/react"
import { useController } from "react-hook-form"
import EditableControls from "./EditableControls"

const PanelDescription = () => {
  const { field } = useController({
    name: "description",
    rules: { required: true },
  })

  return (
    <Editable
      fontSize={"sm"}
      {...field}
      placeholder={"Description"}
      as={HStack}
      wordBreak={"break-word"}
    >
      <EditablePreview />
      <EditableTextarea m="0px !important" />
      <EditableControls />
    </Editable>
  )
}

export default PanelDescription
