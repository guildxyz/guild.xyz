import { Circle, useColorModeValue } from "@chakra-ui/react"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import RewardCard from "components/common/RewardCard"
import dynamic from "next/dynamic"
import rewards from "platforms/rewards"
import Star from "static/icons/star.svg"
import numberToOrdinal from "utils/numberToOrdinal"
import PointsCardButton from "./PointsCardButton"
import useUsersPoints from "./useUsersPoints"

const DynamicPointsCardMenu = dynamic(() => import("./PointsCardMenu"), {
  ssr: false,
})

const PointsRewardCard = ({ guildPlatform }) => {
  const { isAdmin } = useGuildPermission()
  const { name, imageUrl } = guildPlatform.platformGuildData

  const { data, isLoading, error } = useUsersPoints(guildPlatform.id)

  const bgColor = useColorModeValue("gray.700", "gray.600")

  if (error && !isAdmin) return null

  return (
    <>
      <RewardCard
        label={rewards.POINTS.name}
        title={
          isLoading
            ? null
            : `You have ${Math.floor(data?.totalPoints ?? 0)} ${name || "points"}`
        }
        image={
          imageUrl || (
            <Circle size={10} bgColor={bgColor}>
              <Star color="white" />
            </Circle>
          )
        }
        colorScheme={rewards.POINTS.colorScheme}
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
