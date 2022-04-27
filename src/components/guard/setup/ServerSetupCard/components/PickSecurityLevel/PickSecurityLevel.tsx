import {
  FormControl,
  FormLabel,
  StackDivider,
  useColorMode,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { LockSimple, LockSimpleOpen } from "phosphor-react"
import { useController, useFormContext } from "react-hook-form"
import KeepAccessInfoText from "./components/KeepAccessInfoText"
import ModeOption from "./components/SecurityLevelOption"

const options = [
  {
    value: "false",
    title: "Authenticate existing users",
    description: "Ensure that no bots can stay in your server",
    icon: LockSimple,
  },
  {
    value: "true",
    title: "Keep access for existing users",
    description: "Only guard for bots joining after now",
    icon: LockSimpleOpen,
    children: <KeepAccessInfoText />,
  },
]

const PickSecurityLevel = (): JSX.Element => {
  const { colorMode } = useColorMode()

  const {
    control,
    formState: { errors },
  } = useFormContext<any>()

  const { field } = useController({
    control,
    name: "grantAccessToExistingUsers",
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "grantAccessToExistingUsers",
    onChange: field.onChange,
    value: field.value,
    defaultValue: "false",
  })

  const group = getRootProps()

  return (
    <FormControl isRequired isInvalid={!!errors?.platform}>
      <FormLabel>Security level</FormLabel>
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

export default PickSecurityLevel
