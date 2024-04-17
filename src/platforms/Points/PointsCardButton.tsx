import { Icon } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import Link from "next/link"
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
      <Button
        as={Link}
        href={`/${urlName}/leaderboard/${id}`}
        w="full"
        prefetch={false}
      >
        View leaderboard <Icon as={ArrowRight} mb="-0.5" />
      </Button>
    </>
  )
}

export default PointsCardButton
