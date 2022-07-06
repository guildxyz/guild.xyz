import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  Icon,
  Text,
  Wrap,
} from "@chakra-ui/react"
import EditableControls from "components/[guild]/Onboarding/components/SummonMembers/components/PanelBody/components/EditableControls"
import { ArrowSquareOut, Link as LinkIcon } from "phosphor-react"
import { useController } from "react-hook-form"

const EmbedButton = (): JSX.Element => {
  const { field } = useController({
    name: "button",
    rules: { required: true },
  })

  return (
    <Wrap alignItems="center">
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

      <HStack
        bg="gray.500"
        py="1"
        px="4"
        borderRadius={"4px"}
        flexGrow={0}
        opacity={0.4}
        cursor="not-allowed"
      >
        <Text fontSize={"sm"} fontWeight="semibold" color={"white"}>
          Guide
        </Text>
        <ArrowSquareOut color="white" />
      </HStack>
    </Wrap>
  )
}

export default EmbedButton
