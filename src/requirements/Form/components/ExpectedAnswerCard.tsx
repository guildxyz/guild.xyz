import { Tag, Text, Wrap } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import { fieldTypes } from "components/[guild]/CreateFormModal/formConfig"
import Card from "components/common/Card"
import RemoveRequirementButton from "components/create-guild/Requirements/components/RemoveRequirementButton"

export type ExpectedFieldDataProps = {
  value?: string
  minAmount?: number
  maxAmount?: number
  acceptedAnswers?: string[]
  rejectedAnswers?: string[]
}

type Props = {
  field: Schemas["Form"]["fields"][0]
  onRemove: () => void
} & ExpectedFieldDataProps

const ExpectedAnswerCard = ({ field, onRemove, ...data }: Props) => {
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

export const ExactStringDisplay = ({ value }: ExpectedFieldDataProps) => (
  <Text>{value}</Text>
)

export const ExpectedRateDisplay = ({
  minAmount,
  maxAmount,
}: ExpectedFieldDataProps) => <Text>{`min ${minAmount} - max ${maxAmount}`}</Text>

export const ExpectedChoicesDisplay = ({
  acceptedAnswers,
  rejectedAnswers,
}: ExpectedFieldDataProps) => (
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
