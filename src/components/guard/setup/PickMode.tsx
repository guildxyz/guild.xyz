import {
  FormControl,
  StackDivider,
  useColorMode,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormContext } from "react-hook-form"
import ModeOption from "./ModeOption"

const options = [
  {
    value: "REMOVE_BOTS",
    title: "I want to remove bots from my server",
  },
  {
    value: "GUARD_NEW_BOTS",
    title: "I only want to guard against bots joining after now",
  },
]

const PickMode = (): JSX.Element => {
  const { colorMode } = useColorMode()

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  const { field } = useController({
    control,
    name: "mode",
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "mode",
    onChange: field.onChange,
    value: field.value,
    defaultValue: "REMOVE_BOTS",
  })

  const group = getRootProps()

  return (
    <FormControl isRequired isInvalid={!!errors?.platform}>
      <VStack
        {...group}
        borderRadius="xl"
        bg={colorMode === "light" ? "white" : "blackAlpha.300"}
        spacing="0"
        border="1px"
        borderColor={colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300"}
        divider={<StackDivider />}
      >
        {options.map((option) => {
          const radio = getRadioProps({ value: option.value })
          return <ModeOption key={option.value} {...radio} {...option} />
        })}
      </VStack>

      <FormErrorMessage>{errors?.platform?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default PickMode
