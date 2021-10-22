import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"
import GuildCard from "components/index/GuildCard"
import useIsMember from "components/[guild]/JoinButton/hooks/useIsMember"
import useLevelsAccess from "components/[guild]/JoinButton/hooks/useLevelsAccess"
import { Check } from "phosphor-react"
import { Guild } from "temporaryData/types"

type Props = {
  guildData: Guild
}

const GuildAccessCard = ({ guildData }: Props): JSX.Element => {
  const { data: hasAccess, error } = useLevelsAccess("guild", guildData.id)
  const isMember = useIsMember("guild", guildData.id)

  return (
    <GuildCard
      guildData={guildData}
      pb={!error && hasAccess ? { base: 8, sm: 10 } : undefined}
    >
      {!error && hasAccess && (
        <Tag
          position="absolute"
          bottom={0}
          left={0}
          width="full"
          colorScheme="green"
          rounded="none"
        >
          <TagLeftIcon boxSize={4} as={Check} />
          <TagLabel>{isMember ? "You're in!" : "You have access"}</TagLabel>
        </Tag>
      )}
    </GuildCard>
  )
}

export default GuildAccessCard
