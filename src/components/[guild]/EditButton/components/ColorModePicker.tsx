import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react"
import { useColorContext } from "components/[guild]/ColorContext"
import { Moon, Sun } from "phosphor-react"
import { useFormContext } from "react-hook-form"

type Props = {
  label?: string
}

const ColorModePicker = ({ label }: Props): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const { setThemeMode, themeMode } = useColorContext()

  const handleChange = (e) => setThemeMode(e)

  return (
    <VStack spacing={2} alignItems="start">
      <FormControl isInvalid={errors.themeMode}>
        {label && <FormLabel>{label}</FormLabel>}
        <RadioGroup
          defaultValue={themeMode || "DARK"}
          onChange={handleChange}
          name="themeMode"
        >
          <HStack spacing={4}>
            <Radio {...register("themeMode")} colorScheme="primary" value="DARK">
              <Icon as={Moon} />
            </Radio>
            <Radio {...register("themeMode")} colorScheme="primary" value="LIGHT">
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
