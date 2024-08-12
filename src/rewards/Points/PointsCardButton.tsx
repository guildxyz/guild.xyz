import { ArrowRight } from "@phosphor-icons/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import Link from "next/link"
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
        rightIcon={<ArrowRight />}
      >
        View leaderboard
      </Button>
    </>
  )
}

export default PointsCardButton
