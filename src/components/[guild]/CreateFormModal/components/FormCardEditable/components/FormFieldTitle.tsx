import { Text } from "@chakra-ui/react"
import { CreateFieldParams, Field } from "components/[guild]/CreateFormModal/schemas"

type Props = {
  field: CreateFieldParams | Field
}

const FormFieldTitle = ({ field }: Props) => (
  <Text as="span" fontWeight="semibold">
    {field.question}
    {field.isRequired && (
      <Text as="sup" color="red.400" ml={1}>
        *
      </Text>
    )}
  </Text>
)

export default FormFieldTitle
