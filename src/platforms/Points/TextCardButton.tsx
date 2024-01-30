import { Icon } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import LinkButton from "components/common/LinkButton"
import { ArrowRight } from "phosphor-react"
import { GuildPlatform } from "types"

type Props = {
  platform: GuildPlatform
}

const PointsCardButton = ({ platform }: Props) => {
  const { urlName } = useGuild()
  const id = platform.id

  return (
    <>
      <LinkButton
        colorScheme={"gray"}
        href={`/${urlName}/leaderboard/${id}`}
        onClick={() => {}}
        w="full"
      >
        View leaderboard <Icon as={ArrowRight} mb="-0.5" />
      </LinkButton>
    </>
  )
}

export default PointsCardButton
