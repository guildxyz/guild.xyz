import { HStack, Tag, Text, Tooltip, Wrap } from "@chakra-ui/react"
import { ExpectedFieldDataProps } from "./types"

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
    {acceptedAnswers?.map((value) => (
      <Tooltip key={value} label="Must be selected" hasArrow>
        <Tag variant="subtle" colorScheme="green">
          {value}
        </Tag>
      </Tooltip>
    ))}
    {rejectedAnswers?.map((value) => (
      <Tooltip key={value} label="Must not be selected" hasArrow>
        <Tag variant="subtle" colorScheme="red">
          {value}
        </Tag>
      </Tooltip>
    ))}
  </Wrap>
)
