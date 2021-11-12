import { Spinner, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"
import GuildCard from "components/index/GuildCard"
import useIsMember from "components/[guild]/JoinButton/hooks/useIsMember"
import useLevelsAccess from "components/[guild]/JoinButton/hooks/useLevelsAccess"
import { Check, CheckCircle, X } from "phosphor-react"
import { Guild } from "temporaryData/types"
import { Rest } from "types"

type Props = {
  guildData: Guild
} & Rest

const GuildAccessCard = ({ guildData, ...rest }: Props): JSX.Element => {
  const {
    data: hasAccess,
    error,
    isLoading,
  } = useLevelsAccess("guild", guildData.id)
  const isMember = useIsMember("guild", guildData.id)

  const colorScheme = () => {
    if (isMember) return "green"
    if (hasAccess) return "blue"
    return "gray"
  }

  return (
    <GuildCard
      guildData={guildData}
      pb={!error ? 14 : undefined}
      cursor="pointer"
      {...rest}
    >
      {!error && (
        <Tag
          position="absolute"
          bottom={0}
          left={0}
          width="full"
          colorScheme={colorScheme()}
          rounded="none"
          size="lg"
        >
          {isMember ? (
            <>
              <TagLeftIcon boxSize={4} as={CheckCircle} />
              <TagLabel>You're in</TagLabel>
            </>
          ) : isLoading ? (
            <>
              <TagLeftIcon boxSize={3} as={Spinner} />
              <TagLabel>Checking access</TagLabel>
            </>
          ) : hasAccess ? (
            <>
              <TagLeftIcon boxSize={4} as={Check} />
              <TagLabel>You have access</TagLabel>
            </>
          ) : (
            <>
              <TagLeftIcon boxSize={4} as={X} />
              <TagLabel>No access</TagLabel>
            </>
          )}
        </Tag>
      )}
    </GuildCard>
  )
}

export default GuildAccessCard
