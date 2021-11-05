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
import { useColorContext } from "components/common/ColorContext"
import { Moon, Sun } from "phosphor-react"
import { useFormContext } from "react-hook-form"

type Props = {
  label?: string
  fieldName: string
}

const ColorModePicker = ({ label, fieldName }: Props): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const { setLocalThemeMode, localThemeMode } = useColorContext()

  const handleChange = (e) => setLocalThemeMode(e)

  return (
    <VStack spacing={2} alignItems="start">
      <FormControl isInvalid={errors[fieldName]}>
        {label && <FormLabel>{label}</FormLabel>}
        <RadioGroup
          defaultValue={localThemeMode}
          onChange={handleChange}
          name="themeMode"
        >
          <HStack spacing={4}>
            <Radio {...register(fieldName)} colorScheme="primary" value="DARK">
              <Icon as={Moon} />
            </Radio>
            <Radio {...register(fieldName)} colorScheme="primary" value="LIGHT">
              <Icon as={Sun} />
            </Radio>
          </HStack>
        </RadioGroup>
        <FormErrorMessage>{errors[fieldName]?.message}</FormErrorMessage>
      </FormControl>
    </VStack>
  )
}

export default ColorModePicker
