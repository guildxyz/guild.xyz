import { Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import RemoveRequirementButton from "components/create-guild/Requirements/components/RemoveRequirementButton"

const ExpectedAnswerCard = ({ field, value, onRemove }) => {
  if (!field) return null

  return (
    <Card boxShadow={0} borderWidth={"1px"} p="4" pos="relative">
      <Text fontWeight={"semibold"}>{field.question}</Text>
      <Text>{value}</Text>
      <RemoveRequirementButton onClick={onRemove} />
    </Card>
  )
}

export default ExpectedAnswerCard
