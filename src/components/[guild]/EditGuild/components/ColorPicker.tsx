import {
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import Color from "color"
import { useThemeContext } from "components/[guild]/ThemeContext"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { PiPalette } from "react-icons/pi"

type Props = {
  fieldName: string
}

const ColorPicker = ({ fieldName }: Props): JSX.Element => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext()
  const [isIconLight, setIsIconLight] = useState(false)

  const pickedColor = useWatch({ name: fieldName })
  const debouncedPickedColor = useDebouncedState(pickedColor, 300)

  const { setLocalThemeColor } = useThemeContext()

  useEffect(() => {
    if (!CSS.supports("color", debouncedPickedColor)) return
    setLocalThemeColor(debouncedPickedColor)
    const color = Color(pickedColor)
    setIsIconLight(color.isDark())
  }, [debouncedPickedColor, setLocalThemeColor])

  const borderColor = useColorModeValue("gray.300", "whiteAlpha.300")

  return (
    <VStack spacing={2} alignItems="start">
      <FormControl isInvalid={!!errors[fieldName]}>
        <FormLabel>Main color</FormLabel>
        <HStack spacing={2}>
          <Flex
            flexShrink={0}
            boxSize={10}
            alignItems="center"
            justifyContent="center"
            rounded="xl"
            overflow="hidden"
            border="1px"
            borderColor={borderColor}
            _focusWithin={{ shadow: "outline" }}
            transitionDuration="var(--chakra-transition-duration-normal)"
            transitionProperty="var(--chakra-transition-property-common)"
          >
            <Controller
              control={control}
              name={fieldName}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  display="block"
                  p={0}
                  border="none"
                  type="color"
                  minW={16}
                  minH={16}
                  cursor="pointer"
                  placeholder="#4F46E5"
                  isInvalid={!!errors[fieldName]}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  ref={ref}
                />
              )}
            />
            <Icon
              as={PiPalette}
              pos="absolute"
              pointerEvents={"none"}
              color={isIconLight ? "whiteAlpha.800" : "blackAlpha.800"}
            />
          </Flex>
          <Input
            maxWidth={40}
            value={pickedColor}
            onChange={(e) =>
              setValue(fieldName, e.target.value, { shouldDirty: true })
            }
            placeholder="Pick a color"
          />
        </HStack>
        <FormErrorMessage>{errors[fieldName]?.message as string}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}

export default ColorPicker
