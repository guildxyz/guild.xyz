import { Icon } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import Link from "next/link"
import { PiArrowRight } from "react-icons/pi"
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
        View leaderboard <Icon as={PiArrowRight} mb="-0.5" />
      </Button>
    </>
  )
}

export default PointsCardButton
