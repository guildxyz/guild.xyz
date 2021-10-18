import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react"
import { useColorContext } from "components/common/ColorContext"
import { useEffect, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  label?: string
  fieldName: string
}

const ColorPicker = ({ label, fieldName }: Props): JSX.Element => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const colorPickTimeout = useRef(null)
  const pickedColor = useWatch({ name: fieldName })
  const { setThemeColor } = useColorContext()

  useEffect(() => {
    if (colorPickTimeout.current) window.clearTimeout(colorPickTimeout.current)

    colorPickTimeout.current = setTimeout(() => setThemeColor(pickedColor), 300)
  }, [pickedColor])

  return (
    <VStack spacing={2} alignItems="start">
      <FormControl isInvalid={errors[fieldName]}>
        {label && <FormLabel>{label}</FormLabel>}
        <HStack spacing={2}>
          <Flex
            boxSize={10}
            alignItems="center"
            justifyContent="center"
            rounded="xl"
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
              {...register(fieldName)}
              isInvalid={errors[fieldName]}
            />
          </Flex>
          <Input
            maxWidth={40}
            value={pickedColor}
            onChange={(e) => setValue(fieldName, e.target.value)}
            placeholder="Pick a color"
          />
        </HStack>
        <FormErrorMessage>{errors[fieldName]?.message}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}

export default ColorPicker
