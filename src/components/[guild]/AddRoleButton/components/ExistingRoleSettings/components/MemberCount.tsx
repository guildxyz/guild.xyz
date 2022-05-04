import { Spinner, Tag, Text, Tooltip } from "@chakra-ui/react"
import { Warning } from "phosphor-react"
import useDiscordRoleMemberCount from "../hooks/useDiscordRoleMemberCount"

const MemberCount = () => {
  const { memberCount, error, isLoading } = useDiscordRoleMemberCount()

  if (error) {
    return (
      <Tooltip
        label="Failed to count the number of members with the selected role"
        shouldWrapChildren
        placement="right"
      >
        <Warning color="orange" />
      </Tooltip>
    )
  }

  if (isLoading) {
    return (
      <Tooltip
        placement="right"
        label={"Counting the number of members with the selected role"}
      >
        <Tag>
          <Spinner size="xs" />
        </Tag>
      </Tooltip>
    )
  }

  return (
    <Tooltip
      placement="right"
      label={`${memberCount ?? 0} member${
        memberCount === 1 ? " has" : "s have"
      } this role on Discord`}
    >
      <Tag>
        <Text>
          {memberCount ?? 0} member{memberCount === 1 ? "" : "s"}
        </Text>
      </Tag>
    </Tooltip>
  )
}

export default MemberCount
