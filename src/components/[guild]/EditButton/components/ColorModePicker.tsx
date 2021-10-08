import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Radio,
  RadioGroup,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { useGuild } from "components/[guild]/Context"
import { Moon, Sun } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  label?: string
}

const ColorModePicker = ({ label }: Props): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const { colorMode, toggleColorMode } = useColorMode()
  const { themeMode: initialThemeMode } = useGuild()
  const themeMode = useWatch({ name: "themeMode" })

  useEffect(() => {
    if (themeMode && colorMode !== themeMode.toLowerCase()) toggleColorMode()
  }, [themeMode])

  return (
    <VStack spacing={2} alignItems="start">
      <FormControl isInvalid={errors.themeMode}>
        {label && <FormLabel>{label}</FormLabel>}
        <RadioGroup
          defaultValue={colorMode?.toUpperCase() || "DARK"}
          name="themeMode"
        >
          <HStack spacing={4}>
            <Radio
              name="themeMode"
              {...register("themeMode")}
              colorScheme="primary"
              value="DARK"
            >
              <Icon as={Moon} />
            </Radio>
            <Radio
              name="themeMode"
              {...register("themeMode")}
              colorScheme="primary"
              value="LIGHT"
            >
              <Icon as={Sun} />
            </Radio>
          </HStack>
        </RadioGroup>
        <FormErrorMessage>{errors.themeMode?.message}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}

export default ColorModePicker
