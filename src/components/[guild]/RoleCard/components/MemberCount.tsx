import {
  Spinner,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Tooltip,
} from "@chakra-ui/react"
import useActiveStatusUpdates from "hooks/useActiveStatusUpdates"
import { Users } from "phosphor-react"

type Props = {
  memberCount: number
  roleId?: number
}

const MemberCount = ({ memberCount, roleId }: Props) => {
  const { status, progress } = useActiveStatusUpdates(roleId)

  if (status === "STARTED")
    return (
      <Tooltip
        label={`Syncing ${progress.actionsDone}/${progress.total} members`}
        hasArrow
      >
        <Tag colorScheme="blue" mt="2px !important" flexShrink={0}>
          <TagLeftIcon as={Users} boxSize={"16px"} />
          <TagLabel mb="-1px">
            {new Intl.NumberFormat("en", { notation: "compact" }).format(
              memberCount ?? 0
            )}
          </TagLabel>
          <TagRightIcon as={Spinner} />
        </Tag>
      </Tooltip>
    )

  return (
    <Tag bg="unset" color="gray" mt="3px !important" flexShrink={0}>
      <TagLeftIcon as={Users} boxSize={"16px"} />
      <TagLabel mb="-1px">
        {new Intl.NumberFormat("en", { notation: "compact" }).format(
          memberCount ?? 0
        )}
      </TagLabel>
    </Tag>
  )
}

export default MemberCount
