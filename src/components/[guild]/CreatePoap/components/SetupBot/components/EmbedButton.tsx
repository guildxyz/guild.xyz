import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  Icon,
} from "@chakra-ui/react"
import EditableControls from "components/[guild]/Onboarding/components/SummonMembers/components/PanelBody/components/EditableControls"
import { Link as LinkIcon } from "phosphor-react"
import { useController } from "react-hook-form"

const EmbedButton = (): JSX.Element => {
  const { field } = useController({
    name: "button",
    rules: { required: true },
  })

  return (
    <Box bg="DISCORD.500" py="1" px="4" maxW="max-content" borderRadius={"4px"}>
      <Editable
        fontSize={"sm"}
        color="white"
        fontWeight="semibold"
        placeholder={"Button label"}
        {...field}
        as={HStack}
        alignItems="center"
      >
        <Icon as={LinkIcon} boxSize={5} />
        <EditablePreview />
        <EditableInput />
        <EditableControls />
      </Editable>
    </Box>
  )
}

export default EmbedButton
