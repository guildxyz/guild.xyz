import { Text, useColorMode } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

type Props = {
  fieldName: string
}

const ValidationError = ({ fieldName }: Props) => {
  const { colorMode } = useColorMode()
  const {
    formState: { errors },
  } = useFormContext()

  if (!errors[fieldName] || errors[fieldName].message.length <= 0) return null

  return (
    <Text color={colorMode === "light" ? "red.500" : "red.400"} fontSize="sm" mt={2}>
      {errors[fieldName].message}
    </Text>
  )
}

export default ValidationError
