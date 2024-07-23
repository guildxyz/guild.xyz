import { Text } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import { fieldTypes } from "components/[guild]/CreateFormModal/formConfig"
import Card from "components/common/Card"
import RemoveRequirementButton from "components/create-guild/Requirements/components/RemoveRequirementButton"
import { ExpectedFieldDataProps } from "./types"

type Props = {
  field: Schemas["Form"]["fields"][0]
  onRemove: () => void
} & ExpectedFieldDataProps

export const ExpectedAnswerCard = ({ field, onRemove, ...data }: Props) => {
  if (!field) return null

  const selectedFieldType = fieldTypes.find((ft) => ft.value === field?.type)

  return (
    <Card boxShadow={0} borderWidth={"1px"} p="4" pos="relative">
      <Text fontWeight={"semibold"}>{field.question}</Text>
      <selectedFieldType.ExpectedAnswerDisplayComponent {...data} />
      <RemoveRequirementButton onClick={onRemove} />
    </Card>
  )
}
