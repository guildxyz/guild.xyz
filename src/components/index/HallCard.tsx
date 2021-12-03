import { Tag, TagLabel, TagLeftIcon, Tooltip, Wrap } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import useHallMembers from "hooks/useHallMembers"
import { Users } from "phosphor-react"
import { Hall } from "temporaryData/types"
import pluralize from "utils/pluralize"

type Props = {
  hallData: Hall
}

const HallCard = ({ hallData }: Props): JSX.Element => {
  const members = useHallMembers(hallData.guilds)

  return (
    <Link
      href={`/${hallData.urlName}`}
      _hover={{ textDecor: "none" }}
      borderRadius="2xl"
      w="full"
      h="full"
    >
      <DisplayCard image={hallData.imageUrl} title={hallData.name}>
        <Wrap zIndex="1">
          <Tag as="li">
            <TagLeftIcon as={Users} />
            <TagLabel>{members?.length || 0}</TagLabel>
          </Tag>
          <Tooltip
            label={hallData.guilds
              ?.map((guildData) => guildData.guild.name)
              .join(", ")}
          >
            <Tag as="li">
              <TagLabel>{pluralize(hallData.guilds?.length ?? 0, "guild")}</TagLabel>
            </Tag>
          </Tooltip>
        </Wrap>
      </DisplayCard>
    </Link>
  )
}

export default HallCard
