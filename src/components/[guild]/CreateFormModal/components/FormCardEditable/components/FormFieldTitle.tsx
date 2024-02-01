import { Text, TextProps } from "@chakra-ui/react"
import { CreateFieldParams, Field } from "components/[guild]/CreateFormModal/schemas"

type Props = {
  field: CreateFieldParams | Field
} & TextProps

const FormFieldTitle = ({ field, ...textProps }: Props) => (
  <Text as="span" fontWeight="semibold" display="inline-block" {...textProps}>
    {field.question}
    {field.isRequired && (
      <Text as="sup" color="red.400" ml={1}>
        *
      </Text>
    )}
  </Text>
)

export default FormFieldTitle
