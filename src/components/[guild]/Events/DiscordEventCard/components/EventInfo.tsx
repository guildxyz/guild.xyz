import { HStack, StackProps, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"
import { Clock, Users } from "phosphor-react"

type Props = {
  startDate: number
  userCount: number
} & StackProps

const EventInfo = ({ startDate, userCount, ...rest }: Props): JSX.Element => {
  const LOCALE = "en-US"
  const TO_LOCALE_STRING_OPTIONS: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  const formatedDateTime = new Date(startDate).toLocaleDateString(
    LOCALE,
    TO_LOCALE_STRING_OPTIONS
  )

  return (
    <HStack w="full" {...rest}>
      <Tag>
        <TagLeftIcon as={Clock} boxSize={3.5} />
        <TagLabel> {formatedDateTime}</TagLabel>
      </Tag>
      {userCount && (
        <Tag>
          <TagLeftIcon as={Users} boxSize={3.5} />
          <TagLabel> {userCount}</TagLabel>
        </Tag>
      )}
    </HStack>
  )
}

export default EventInfo
