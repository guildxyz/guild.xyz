import { HStack, Tag, Text, Tooltip, Wrap } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import { fieldTypes } from "components/[guild]/CreateFormModal/formConfig"
import Card from "components/common/Card"
import RemoveRequirementButton from "components/create-guild/Requirements/components/RemoveRequirementButton"

// couldn't do type based props so just having all props here as optional, works well enough
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

export const ExpectedStringDisplay = ({ value }: ExpectedFieldDataProps) => (
  <Text>{`"${value}"`}</Text>
)

export const ExpectedRateDisplay = ({
  minAmount,
  maxAmount,
}: ExpectedFieldDataProps) => (
  <HStack mt="1">
    <Tag>{minAmount}</Tag>
    <Text>-</Text>
    <Tag>{maxAmount}</Tag>
  </HStack>
)

export const ExpectedMultipleChoiceDisplay = ({
  acceptedAnswers,
  rejectedAnswers,
}: ExpectedFieldDataProps) => (
  <Wrap mt="1" spacing={1}>
    {acceptedAnswers.map((value) => (
      <Tooltip key={value} label="Must be selected" hasArrow>
        <Tag variant="subtle" colorScheme="green">
          {value}
        </Tag>
      </Tooltip>
    ))}
    {rejectedAnswers.map((value) => (
      <Tooltip key={value} label="Must not be selected" hasArrow>
        <Tag variant="subtle" colorScheme="red">
          {value}
        </Tag>
      </Tooltip>
    ))}
  </Wrap>
)

export default ExpectedAnswerCard
