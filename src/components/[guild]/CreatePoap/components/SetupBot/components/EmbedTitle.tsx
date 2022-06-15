import {
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react"
import EditableControls from "components/[guild]/Onboarding/components/SummonMembers/components/PanelBody/components/EditableControls"
import { useController } from "react-hook-form"

const EmbedTitle = (): JSX.Element => {
  const color = useColorModeValue("#2a66d8", "#4EACEE")

  const { field } = useController({
    name: "title",
    rules: { required: true },
  })

  return (
    <Editable
      {...field}
      placeholder={"Title"}
      fontWeight={"bold"}
      color={color}
      as={HStack}
    >
      <EditablePreview />
      <EditableInput marginInlineStart="0 !important" width="min" />
      <EditableControls />
    </Editable>
  )
}

export default EmbedTitle
