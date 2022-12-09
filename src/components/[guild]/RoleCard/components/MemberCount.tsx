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
        label={`Syncing ${progress.accessCheckDone}/${progress.total} members`}
        hasArrow
      >
        <Tag colorScheme="blue" mt="1 !important" ml="4 !important">
          <TagLeftIcon as={Users} />
          <TagLabel>{memberCount}</TagLabel>
          <TagRightIcon as={Spinner} />
        </Tag>
      </Tooltip>
    )

  return (
    <Tag bg="unset" color="gray" size="lg" mt="1 !important">
      <TagLeftIcon as={Users} />
      <TagLabel>{memberCount}</TagLabel>
    </Tag>
  )
}

export default MemberCount
