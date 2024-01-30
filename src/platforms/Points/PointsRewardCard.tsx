import { Circle, useColorModeValue } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useUser from "components/[guild]/hooks/useUser"
import RewardCard from "components/common/RewardCard"
import dynamic from "next/dynamic"
import platforms from "platforms/platforms"
import Star from "static/icons/star.svg"
import useSWR from "swr"
import numberToOrdinal from "utils/numberToOrdinal"
import PointsCardButton from "./PointsCardButton"

const DynamicPointsCardMenu = dynamic(() => import("./PointsCardMenu"), {
  ssr: false,
})

const PointsRewardCard = ({ guildPlatform }) => {
  const { isAdmin } = useGuildPermission()
  const { id: userId } = useUser()
  const { id: guildId } = useGuild()
  const pointsId = guildPlatform.id

  const { name, imageUrl } = guildPlatform.platformGuildData

  const { data, isLoading, error } = useSWR(
    `/v2/guilds/${guildId}/points/${pointsId}/users/${userId}`
  )

  const bgColor = useColorModeValue("gray.700", "gray.600")

  if (error) return null

  return (
    <>
      <RewardCard
        label={platforms.POINTS.name}
        title={
          isLoading ? null : `You have ${data?.totalPoints} ${name || "points"}`
        }
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
        description={
          data?.rank && `${numberToOrdinal(data?.rank)} on the leaderboard`
        }
      >
        <PointsCardButton platform={guildPlatform} />
      </RewardCard>
    </>
  )
}

export default PointsRewardCard
