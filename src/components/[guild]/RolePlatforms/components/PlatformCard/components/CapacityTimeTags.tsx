import { Tag, TagLabel, TagLeftIcon, Tooltip, Wrap } from "@chakra-ui/react"
import { Clock } from "phosphor-react"
import { useState } from "react"
import { RolePlatform } from "types"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

type Props = { rolePlatform: RolePlatform }

const currentTime = Date.now()

const CapacityTimeTags = ({ rolePlatform }: Props) => {
  const [showClaimed, setShowClaimed] = useState(false)

  const startTimeDiff = !rolePlatform?.startTime
    ? undefined
    : new Date(rolePlatform.startTime).getTime() - currentTime

  const endTimeDiff = !rolePlatform?.endTime
    ? undefined
    : new Date(rolePlatform.endTime).getTime() - currentTime

  return (
    <Wrap>
      {typeof rolePlatform.capacity === "number" && (
        <Tag
          onClick={() => setShowClaimed((prevValue) => !prevValue)}
          cursor="default"
        >
          {showClaimed
            ? `${rolePlatform.capacity - (rolePlatform.claimedCapacity ?? 0)} / ${
                rolePlatform.capacity
              } available`
            : `${rolePlatform.claimedCapacity ?? 0} / ${
                rolePlatform.capacity
              } claimed`}
        </Tag>
      )}

      {startTimeDiff > 0 && (
        <Tooltip
          label={new Date(rolePlatform.startTime).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          placement="top"
          hasArrow
        >
          <Tag>
            <TagLeftIcon as={Clock} />
            <TagLabel>{`Claim starts in ${formatRelativeTimeFromNow(
              startTimeDiff
            )}`}</TagLabel>
          </Tag>
        </Tooltip>
      )}

      {endTimeDiff > 0 && (
        <Tooltip
          label={new Date(rolePlatform.endTime).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          placement="top"
          hasArrow
        >
          <Tag>
            <TagLeftIcon as={Clock} />
            <TagLabel>
              {endTimeDiff <= 0
                ? "Claim ended"
                : `Claim ends in ${formatRelativeTimeFromNow(endTimeDiff)}`}
            </TagLabel>
          </Tag>
        </Tooltip>
      )}
    </Wrap>
  )
}

export default CapacityTimeTags
