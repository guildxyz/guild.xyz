import { Tag, TagLabel, TagLeftIcon, Tooltip } from "@chakra-ui/react"
import { Clock } from "phosphor-react"
import { RolePlatform } from "types"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

const currentTime = Date.now()

type Props = { rolePlatform: RolePlatform }

const EndTimeTag = ({ rolePlatform }: Props) => {
  const timeDiff = !rolePlatform?.endTime
    ? undefined
    : new Date(rolePlatform.endTime).getTime() - currentTime

  if (!timeDiff) return null

  return (
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
          {timeDiff <= 0
            ? "Claim ended"
            : `Claim ends in ${formatRelativeTimeFromNow(timeDiff)}`}
        </TagLabel>
      </Tag>
    </Tooltip>
  )
}
export default EndTimeTag
