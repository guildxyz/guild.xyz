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
import { useController } from "react-hook-form"
import { PiArrowSquareOut } from "react-icons/pi"
import { PiLink } from "react-icons/pi"
import EditableControls from "./PanelBody/components/EditableControls"

const PanelButton = () => {
  const { field } = useController({
    name: "button",
    rules: { required: true },
  })

  return (
    <Wrap alignItems={"center"} mt={2}>
      <Box bg="DISCORD.500" py="1" px="4" borderRadius={"4px"}>
        <Editable
          fontSize={"sm"}
          color="white"
          fontWeight="semibold"
          placeholder={"Button label"}
          {...field}
          as={HStack}
          alignItems="center"
        >
          <Icon as={PiLink} boxSize={5} />
          <EditablePreview />
          <EditableInput />
          <EditableControls color="white" />
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
        <PiArrowSquareOut color="white" />
      </HStack>
    </Wrap>
  )
}

export default PanelButton
