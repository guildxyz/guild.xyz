import { Text, TextProps } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import { CreateForm } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"

type Props = {
  field: Schemas["Field"] | CreateForm["fields"][number]
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
