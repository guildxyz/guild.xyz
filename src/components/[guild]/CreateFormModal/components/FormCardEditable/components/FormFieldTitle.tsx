import { Text, TextProps } from "@chakra-ui/react"
import { Field } from "components/[guild]/CreateFormModal/schemas"
import { CreateForm } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"

type Props = {
  field: Field | CreateForm["fields"][number]
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
