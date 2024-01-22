import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import Star from "static/icons/star.svg"
import useSWR from "swr"
import { GuildPlatform, PlatformName } from "types"

const usePointsCardProps = (guildPlatform: GuildPlatform) => {
  const { id: userId } = useUser()
  const { id: guildId } = useGuild()

  const pointsId = guildPlatform.id

  const { name, imageUrl } = guildPlatform.platformGuildData

  const { data, isLoading, error } = useSWR(
    `/v2/guilds/${guildId}/points/${pointsId}/users/${userId}`
  )

  const totalPoints = data?.totalPoints

  const text =
    totalPoints !== undefined
      ? `You have ${totalPoints} ${name || "points"}`
      : `Failed to load your score`

  return {
    type: "POINTS" as PlatformName,
    image: imageUrl || <Star />,
    name: text,
  }
}

export default usePointsCardProps
