import { IconButton, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useRouter } from "next/router"
import { useState } from "react"
import { PiArrowsClockwise } from "react-icons/pi"
import useGuild from "../hooks/useGuild"
import usePointsLeaderboard, {
  PointsLeaderboardResponse,
} from "./hooks/usePointsLeaderboard"

type Props = {
  size?: "FULL" | "ICON"
}

const RecalculateLeaderboardButton = ({ size = "FULL" }: Props) => {
  const { id: guildId } = useGuild()
  const { query } = useRouter()

  const [shouldRecalculate, setShouldRecalculate] = useState(false)

  const { mutate: mutateCachedLeaderboard } = usePointsLeaderboard()
  const showErrorToast = useShowErrorToast()
  const { mutate: recalculateLeaderboard, isValidating } =
    useSWRWithOptionalAuth<PointsLeaderboardResponse>(
      shouldRecalculate
        ? `/v2/guilds/${guildId}/points/${query.pointsId}/leaderboard?forceRecalculate=true`
        : null,
      {
        onError: (error: any) => {
          showErrorToast(error)
        },
        onSuccess: (newData: PointsLeaderboardResponse) => {
          mutateCachedLeaderboard(() => newData, { revalidate: false })
        },
      },
      false
    )

  const onClick = () => {
    if (shouldRecalculate) recalculateLeaderboard()
    else setShouldRecalculate(true)
  }

  return size === "ICON" ? (
    <Tooltip
      label={isValidating ? "Refreshing..." : "Refresh leaderboard"}
      placement="top"
      hasArrow
    >
      <IconButton
        size="sm"
        aria-label="Refresh leaderboard"
        icon={<PiArrowsClockwise />}
        onClick={onClick}
        isLoading={isValidating}
      />
    </Tooltip>
  ) : (
    <Button
      size="sm"
      leftIcon={<PiArrowsClockwise />}
      onClick={onClick}
      isLoading={isValidating}
      loadingText="Refreshing"
    >
      Refresh
    </Button>
  )
}
export default RecalculateLeaderboardButton
