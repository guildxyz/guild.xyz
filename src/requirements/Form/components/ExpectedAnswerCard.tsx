import { Tag, Text, Wrap } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import Card from "components/common/Card"
import RemoveRequirementButton from "components/create-guild/Requirements/components/RemoveRequirementButton"

type DataProps = {
  value?: string
  minAmount?: number
  maxAmount?: number
  acceptedAnswers?: string[]
  rejectedAnswers?: string[]
}

type Props = {
  field: Schemas["Form"]["fields"][0]
  onRemove: () => void
} & DataProps

const ExpectedAnswerCard = ({ field, onRemove, ...data }: Props) => {
  if (!field) return null

  return (
    <Card boxShadow={0} borderWidth={"1px"} p="4" pos="relative">
      <Text fontWeight={"semibold"}>{field.question}</Text>
      {field.type === "RATE" ? (
        <ExpectedRateDisplay {...data} />
      ) : field.type === "MULTIPLE_CHOICE" ? (
        <ExpectedChoiceDisplay {...data} />
      ) : (
        <ExactStringDisplay {...data} />
      )}
      <RemoveRequirementButton onClick={onRemove} />
    </Card>
  )
}

const ExactStringDisplay = ({ value }: DataProps) => <Text>{value}</Text>

const ExpectedRateDisplay = ({ minAmount, maxAmount }: DataProps) => (
  <Text>{`min ${minAmount} - max ${maxAmount}`}</Text>
)

const ExpectedChoiceDisplay = ({ acceptedAnswers, rejectedAnswers }: DataProps) => (
  <Wrap mt="1" spacing={1}>
    {acceptedAnswers.map((value) => (
      <Tag key={value} variant="subtle" colorScheme="green">
        {value}
      </Tag>
    ))}
    {rejectedAnswers.map((value) => (
      <Tag key={value} variant="subtle" colorScheme="red">
        {value}
      </Tag>
    ))}
  </Wrap>
)

export default ExpectedAnswerCard
