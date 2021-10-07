import {
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

const ColorModePicker = (): JSX.Element => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()

  return (
    <VStack spacing={2} alignItems="start">
      <FormControl isInvalid={errors.themeMode}>
        <RadioGroup
          defaultValue="DARK"
          onChange={(themeMode) => setValue("themeMode", themeMode)}
        >
          <HStack spacing={4}>
            <Radio colorScheme="primary" value="DARK">
              Dark mode
            </Radio>
            <Radio colorScheme="primary" value="LIGHT">
              Light mode
            </Radio>
          </HStack>
        </RadioGroup>
        <Input type="hidden" {...register("themeMode")} defaultValue="DARK" />
        <FormErrorMessage>{errors.themeMode?.message}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}

export default ColorModePicker
