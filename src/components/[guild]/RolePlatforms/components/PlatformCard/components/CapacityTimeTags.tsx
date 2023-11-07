import {
  Tag,
  TagLabel,
  TagLeftIcon,
  TagProps,
  Tooltip,
  Wrap,
  WrapProps,
} from "@chakra-ui/react"
import { Clock } from "phosphor-react"
import { useState } from "react"
import { RolePlatform } from "types"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

type Props = { rolePlatform: RolePlatform } & WrapProps

export const getTimeDiff = (dateString: string) => {
  if (!dateString) return undefined
  return new Date(dateString).getTime() - Date.now()
}

export const shouldShowCapacityTimeTags = (rolePlatform?: RolePlatform): boolean =>
  typeof rolePlatform?.capacity === "number" ||
  !!rolePlatform?.startTime ||
  !!rolePlatform?.endTime

const CapacityTimeTags = ({ rolePlatform, ...wrapProps }: Props) => {
  if (shouldShowCapacityTimeTags(rolePlatform)) return null

  return (
    <Wrap {...wrapProps}>
      {typeof rolePlatform.capacity === "number" && (
        <CapacityTag
          capacity={rolePlatform.capacity}
          claimedCapacity={rolePlatform.claimedCapacity}
        />
      )}

      {rolePlatform?.startTime && (
        <StartTimeTag startTime={rolePlatform.startTime} />
      )}

      {rolePlatform?.endTime && <EndTimeTag endTime={rolePlatform.endTime} />}
    </Wrap>
  )
}

const CapacityTag = ({
  capacity,
  claimedCapacity,
  ...rest
}: { capacity: number; claimedCapacity?: number } & TagProps) => {
  const [showClaimed, setShowClaimed] = useState(false)

  return (
    <Tag
      onClick={() => setShowClaimed((prevValue) => !prevValue)}
      cursor="default"
      {...rest}
    >
      {showClaimed
        ? `${capacity - (claimedCapacity ?? 0)} / ${capacity} available`
        : `${claimedCapacity ?? 0} / ${capacity} claimed`}
    </Tag>
  )
}

const StartTimeTag = ({ startTime, ...rest }: { startTime: string } & TagProps) => {
  if (!startTime) return null

  const startTimeDiff = getTimeDiff(startTime)

  if (startTimeDiff < 0) return null

  return (
    <Tooltip
      label={new Date(startTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      placement="top"
      hasArrow
    >
      <Tag {...rest}>
        <TagLeftIcon as={Clock} mr={1} />
        <TagLabel>{`Claim starts in ${formatRelativeTimeFromNow(
          startTimeDiff
        )}`}</TagLabel>
      </Tag>
    </Tooltip>
  )
}

const EndTimeTag = ({ endTime, ...rest }: { endTime: string } & TagProps) => {
  const endTimeDiff = getTimeDiff(endTime)

  return (
    <Tooltip
      label={new Date(endTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      placement="top"
      hasArrow
    >
      <Tag {...rest}>
        <TagLeftIcon as={Clock} mr={1} />
        <TagLabel>
          {endTimeDiff <= 0
            ? "Claim ended"
            : `Claim ends in ${formatRelativeTimeFromNow(endTimeDiff)}`}
        </TagLabel>
      </Tag>
    </Tooltip>
  )
}

export default CapacityTimeTags
export { CapacityTag, EndTimeTag, StartTimeTag }
