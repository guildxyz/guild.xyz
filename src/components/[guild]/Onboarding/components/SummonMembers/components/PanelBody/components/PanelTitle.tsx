import {
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react"
import { useController } from "react-hook-form"
import EditableControls from "./EditableControls"

const PanelTitle = () => {
  const color = useColorModeValue("#2a66d8", "#4EACEE")

  const { field } = useController({
    name: "title",
    rules: { required: true },
  })

  return (
    <Editable
      fontWeight={"bold"}
      {...field}
      placeholder={"Title"}
      color={color}
      as={HStack}
      wordBreak={"break-word"}
    >
      <EditablePreview />
      <EditableInput marginInlineStart="0 !important" width="min" />
      <EditableControls />
    </Editable>
  )
}

export default PanelTitle
