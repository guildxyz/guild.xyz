import {
  Editable,
  EditablePreview,
  EditableTextarea,
  HStack,
} from "@chakra-ui/react"
import EditableControls from "components/[guild]/Onboarding/components/SummonMembers/components/PanelBody/components/EditableControls"
import { useController } from "react-hook-form"

const EmbedDescription = (): JSX.Element => {
  const { field } = useController({
    name: "description",
    rules: { required: true },
  })

  return (
    <Editable {...field} placeholder={"Description"} fontSize="sm" as={HStack}>
      <EditablePreview />
      <EditableTextarea m="0px !important" />
      <EditableControls />
    </Editable>
  )
}

export default EmbedDescription
