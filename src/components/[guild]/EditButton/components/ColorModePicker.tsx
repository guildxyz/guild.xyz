import {
  FormControl,
  FormErrorMessage,
  HStack,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

const ColorModePicker = (): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <VStack spacing={2} alignItems="start">
      <FormControl isInvalid={errors.themeMode}>
        <RadioGroup defaultValue="DARK" name="themeMode">
          <HStack spacing={4}>
            <Radio
              name="themeMode"
              {...register("themeMode")}
              colorScheme="primary"
              value="DARK"
            >
              Dark mode
            </Radio>
            <Radio
              name="themeMode"
              {...register("themeMode")}
              colorScheme="primary"
              value="LIGHT"
            >
              Light mode
            </Radio>
          </HStack>
        </RadioGroup>
        <FormErrorMessage>{errors.themeMode?.message}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}

export default ColorModePicker
