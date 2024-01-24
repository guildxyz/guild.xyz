import { Circle, useColorModeValue } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useUser from "components/[guild]/hooks/useUser"
import RewardCard from "components/common/RewardCard"
import dynamic from "next/dynamic"
import { Star } from "phosphor-react"
import platforms from "platforms/platforms"
import useSWR from "swr"
import numberToOrdinal from "utils/numberToOrdinal"
import PointsCardButton from "./TextCardButton"

const DynamicPointsCardMenu = dynamic(() => import("./PointsCardMenu"), {
  ssr: false,
})

const PointsRewardCard = ({ guildPlatform }) => {
  const { isAdmin } = useGuildPermission()
  const { id: userId } = useUser()
  const { id: guildId } = useGuild()
  const pointsId = guildPlatform.id

  const { name, imageUrl } = guildPlatform.platformGuildData

  const { data, isLoading } = useSWR(
    `/v2/guilds/${guildId}/points/${pointsId}/users/${userId}`
  )

  const totalPoints = data?.totalPoints
  const rank = data?.rank

  const text =
    totalPoints !== undefined
      ? `You have ${totalPoints} ${name || "points"}`
      : `Failed to load your score`

  const info =
    rank !== undefined ? `${numberToOrdinal(rank)} on the leaderboard` : ``

  const bgColor = useColorModeValue("gray.700", "gray.600")

  return (
    <>
      <RewardCard
        label={platforms.POINTS.name}
        title={isLoading ? null : text}
        image={
          imageUrl || (
            <Circle size={10} bgColor={bgColor}>
              <Star color="white" />
            </Circle>
          )
        }
        colorScheme={platforms.POINTS.colorScheme}
        cornerButton={
          isAdmin && (
            <DynamicPointsCardMenu
              platformGuildId={guildPlatform.platformGuildId}
            ></DynamicPointsCardMenu>
          )
        }
        description={info}
      >
        <PointsCardButton platform={guildPlatform}></PointsCardButton>
      </RewardCard>
    </>
  )
}

export default PointsRewardCard
