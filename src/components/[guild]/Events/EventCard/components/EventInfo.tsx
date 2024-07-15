import { HStack, StackProps, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"
import { PiClock } from "react-icons/pi"
import { PiUsers } from "react-icons/pi"

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
        <TagLeftIcon as={PiClock} boxSize={3.5} />
        <TagLabel> {formatedDateTime}</TagLabel>
      </Tag>
      {userCount && (
        <Tag>
          <TagLeftIcon as={PiUsers} boxSize={3.5} />
          <TagLabel> {userCount}</TagLabel>
        </Tag>
      )}
    </HStack>
  )
}

export default EventInfo
