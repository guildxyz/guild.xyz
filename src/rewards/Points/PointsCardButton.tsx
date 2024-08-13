import { ArrowRight } from "@phosphor-icons/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Link from "next/link"
import { RewardCardButton } from "rewards/components/RewardCardButton"
import { GuildPlatform } from "types"

type Props = {
  platform: GuildPlatform
}

const PointsCardButton = ({ platform }: Props) => {
  const { urlName } = useGuild()
  const id = platform.id

  return (
    <RewardCardButton
      as={Link}
      href={`/${urlName}/leaderboard/${id}`}
      prefetch={false}
      rightIcon={<ArrowRight />}
    >
      View leaderboard
    </RewardCardButton>
  )
}

export default PointsCardButton
