import { Text } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import Card from "components/common/Card"
import RemoveRequirementButton from "components/create-guild/Requirements/components/RemoveRequirementButton"

type Props = {
  field: Schemas["Form"]["fields"][0]
  value?: string
  minAmount?: number
  maxAmount?: number
  onRemove: () => void
}

const ExpectedAnswerCard = ({
  field,
  value,
  minAmount,
  maxAmount,
  onRemove,
}: Props) => {
  if (!field) return null

  return (
    <Card boxShadow={0} borderWidth={"1px"} p="4" pos="relative">
      <Text fontWeight={"semibold"}>{field.question}</Text>
      {field.type === "RATE" ? (
        <Text>{`min ${minAmount} - max ${maxAmount}`}</Text>
      ) : (
        <Text>{value}</Text>
      )}
      <RemoveRequirementButton onClick={onRemove} />
    </Card>
  )
}

export default ExpectedAnswerCard
