import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"

const ColorPicker = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const pickedColor = useWatch({ name: "themeColor" })

  return (
    <VStack spacing={2} alignItems="start">
      <FormControl isInvalid={errors.themeColor}>
        <FormLabel>Main color</FormLabel>
        <HStack spacing={4}>
          <Flex
            boxSize={10}
            alignItems="center"
            justifyContent="center"
            rounded="full"
            overflow="hidden"
          >
            <Input
              display="block"
              p={0}
              border="none"
              type="color"
              minW={16}
              minH={16}
              cursor="pointer"
              placeholder="#4F46E5"
              {...register("themeColor")}
              isInvalid={errors.themeColor}
            />
          </Flex>
          <Input
            maxWidth={40}
            value={pickedColor}
            onChange={(e) => setValue("themeColor", e.target.value)}
            placeholder="Pick a color"
          />
        </HStack>
        <FormErrorMessage>{errors.themeColor?.message}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}

export default ColorPicker
