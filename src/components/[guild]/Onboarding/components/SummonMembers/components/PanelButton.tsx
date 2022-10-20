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
import useDatadog from "components/_app/Datadog/useDatadog"
import useDebouncedState from "hooks/useDebouncedState"
import { ArrowSquareOut, Link as LinkIcon } from "phosphor-react"
import { useEffect } from "react"
import { useController } from "react-hook-form"
import EditableControls from "./PanelBody/components/EditableControls"

const PanelButton = () => {
  const { addDatadogAction } = useDatadog()

  const { field, fieldState } = useController({
    name: "button",
    rules: { required: true },
  })

  const isDirty = useDebouncedState(fieldState.isDirty)

  useEffect(() => {
    if (!isDirty) return
    addDatadogAction("modified dc embed button")
  }, [isDirty])

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

export default PanelButton
