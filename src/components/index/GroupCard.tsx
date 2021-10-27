import { Tag, TagLabel, TagLeftIcon, Tooltip, Wrap } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import useGroupMembers from "hooks/useGroupMembers"
import { Users } from "phosphor-react"
import { Group } from "temporaryData/types"

type Props = {
  groupData: Group
}

const GroupCard = ({ groupData }: Props): JSX.Element => {
  const members = useGroupMembers(groupData.guilds)

  return (
    <Link
      href={`/${groupData.urlName}`}
      _hover={{ textDecor: "none" }}
      borderRadius="2xl"
      w="full"
    >
      <DisplayCard image={groupData.imageUrl} title={groupData.name}>
        <Wrap zIndex="1">
          <Tag as="li">
            <TagLeftIcon as={Users} />
            <TagLabel>{members?.length || 0}</TagLabel>
          </Tag>
          <Tooltip
            label={groupData.guilds
              .map((guildData) => guildData.guild.name)
              .join(", ")}
          >
            <Tag as="li">
              <TagLabel>
                {(() => {
                  const reqCount = groupData.guilds?.length || 0
                  return `${reqCount} guild${reqCount > 1 ? "s" : ""}`
                })()}
              </TagLabel>
            </Tag>
          </Tooltip>
        </Wrap>
      </DisplayCard>
    </Link>
  )
}

export default GroupCard
