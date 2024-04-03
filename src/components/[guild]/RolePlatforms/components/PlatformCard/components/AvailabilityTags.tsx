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
import { PropsWithChildren, useState } from "react"
import { RolePlatform } from "types"
import formatRelativeTimeFromNow, {
  DAY_IN_MS,
} from "utils/formatRelativeTimeFromNow"

type Props = { rolePlatform: Omit<RolePlatform, "id" | "guildPlatform"> } & WrapProps

export const getTimeDiff = (dateString: string) => {
  if (!dateString) return undefined
  return new Date(dateString).getTime() - Date.now()
}

export const shouldShowAvailabilityTags = (
  rolePlatform?: Omit<RolePlatform, "id" | "guildPlatform">
): boolean =>
  typeof rolePlatform?.capacity === "number" ||
  !!rolePlatform?.startTime ||
  !!rolePlatform?.endTime

const AvailabilityTags = ({
  rolePlatform,
  children,
  ...wrapProps
}: PropsWithChildren<Props>) => {
  if (!children && !shouldShowAvailabilityTags(rolePlatform)) return null

  return (
    <Wrap spacing={1} {...wrapProps}>
      {typeof rolePlatform.capacity === "number" && (
        <CapacityTag
          capacity={rolePlatform.capacity}
          claimedCount={rolePlatform.claimedCount}
        />
      )}

      {rolePlatform?.startTime && (
        <StartTimeTag startTime={rolePlatform.startTime} />
      )}

      {rolePlatform?.endTime && <EndTimeTag endTime={rolePlatform.endTime} />}

      {children}
    </Wrap>
  )
}

const CapacityTag = ({
  capacity,
  claimedCount = 0,
  ...rest
}: { capacity: number; claimedCount?: number } & TagProps) => {
  const [showClaimed, setShowClaimed] = useState(false)

  const available = capacity - claimedCount < 0 ? 0 : capacity - claimedCount

  return (
    <Tooltip label={showClaimed ? "Show available" : "Show claimed"} hasArrow>
      <Tag
        onClick={() => setShowClaimed((prevValue) => !prevValue)}
        cursor="pointer"
        {...rest}
      >
        {showClaimed
          ? `${claimedCount} / ${capacity} claimed`
          : `${available} / ${capacity} available`}
      </Tag>
    </Tooltip>
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
        hour: "numeric",
        minute: "numeric",
      })}
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
        hour: "numeric",
        minute: "numeric",
      })}
      placement="top"
      hasArrow
    >
      <Tag {...rest}>
        <TagLeftIcon as={Clock} mr={1} />
        <TagLabel>
          {endTimeDiff <= 0
            ? "Claim ended"
            : `Claim ends ${
                endTimeDiff > DAY_IN_MS
                  ? `in ${formatRelativeTimeFromNow(endTimeDiff)}`
                  : "today"
              }`}
        </TagLabel>
      </Tag>
    </Tooltip>
  )
}

export default AvailabilityTags
export { CapacityTag, EndTimeTag, StartTimeTag }
