import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useUser from "components/[guild]/hooks/useUser"
import RewardCard from "components/common/RewardCard"
import { Star } from "phosphor-react"
import platforms from "platforms/platforms"
import useSWR from "swr"
import numberToOrdinal from "utils/numberToOrdinal"
import PointsCardMenu from "./PointsCardMenu"
import PointsCardButton from "./TextCardButton"

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

  return (
    <>
      <RewardCard
        label={platforms.POINTS.name}
        title={isLoading ? null : text}
        image={imageUrl || <Star />}
        colorScheme={platforms.POINTS.colorScheme}
        cornerButton={
          isAdmin && (
            <PointsCardMenu
              platformGuildId={guildPlatform.platformGuildId}
            ></PointsCardMenu>
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
