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
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"
import { DAY_IN_MS } from "../../EditRolePlatformCapacityTimeModal"

type Props = { rolePlatform: RolePlatform } & WrapProps

export const getTimeDiff = (dateString: string) => {
  if (!dateString) return undefined
  return new Date(dateString).getTime() - Date.now()
}

export const shouldShowCapacityTimeTags = (rolePlatform?: RolePlatform): boolean =>
  typeof rolePlatform?.capacity === "number" ||
  !!rolePlatform?.startTime ||
  !!rolePlatform?.endTime

const CapacityTimeTags = ({
  rolePlatform,
  children,
  ...wrapProps
}: PropsWithChildren<Props>) => {
  if (!children && !shouldShowCapacityTimeTags(rolePlatform)) return null

  return (
    <Wrap {...wrapProps}>
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
  claimedCount,
  ...rest
}: { capacity: number; claimedCount?: number } & TagProps) => {
  const [showClaimed, setShowClaimed] = useState(false)

  return (
    <Tooltip label={showClaimed ? "Show available" : "Show claimed"} hasArrow>
      <Tag
        onClick={() => setShowClaimed((prevValue) => !prevValue)}
        cursor="pointer"
        {...rest}
      >
        {showClaimed
          ? `${claimedCount ?? 0} / ${capacity} claimed`
          : `${capacity - (claimedCount ?? 0)} / ${capacity} available`}
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

export default CapacityTimeTags
export { CapacityTag, EndTimeTag, StartTimeTag }
