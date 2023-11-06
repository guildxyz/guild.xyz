import { Tag, TagLabel, TagLeftIcon, Tooltip } from "@chakra-ui/react"
import { Clock } from "phosphor-react"
import { RolePlatform } from "types"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

const currentTime = Date.now()

type Props = { rolePlatform: RolePlatform }

const StartTimeTag = ({ rolePlatform }: Props) => {
  const timeDiff = !rolePlatform?.startTime
    ? undefined
    : new Date(rolePlatform.startTime).getTime() - currentTime

  if (!timeDiff || timeDiff <= 0) return null

  return (
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
          timeDiff
        )}`}</TagLabel>
      </Tag>
    </Tooltip>
  )
}
export default StartTimeTag
