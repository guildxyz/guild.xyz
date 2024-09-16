import { ColorPicker } from "@/components/ui/ColorPicker"
import { FormControl, FormLabel } from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext } from "react-hook-form"

type Props = {
  fieldName: string
}

const GuildColorPicker = ({ fieldName }: Props): JSX.Element => {
  const {
    formState: { errors },
  } = useFormContext()

  const { setLocalThemeColor } = useThemeContext()

  return (
    <FormControl isInvalid={!!errors[fieldName]} w="auto">
      <FormLabel>Main color</FormLabel>
      <ColorPicker fieldName={fieldName} onChange={setLocalThemeColor} />
      <FormErrorMessage>{errors[fieldName]?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default GuildColorPicker
