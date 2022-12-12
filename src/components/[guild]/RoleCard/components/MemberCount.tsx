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
        <Tag colorScheme="blue" mt="5px !important" ml="4 !important">
          <TagLeftIcon as={Users} boxSize={"16px"} />
          <TagLabel mb="-1px">{memberCount}</TagLabel>
          <TagRightIcon as={Spinner} />
        </Tag>
      </Tooltip>
    )

  return (
    <Tag bg="unset" color="gray" mt="6px !important">
      <TagLeftIcon as={Users} boxSize={"16px"} />
      <TagLabel mb="-1px">{memberCount}</TagLabel>
    </Tag>
  )
}

export default MemberCount
