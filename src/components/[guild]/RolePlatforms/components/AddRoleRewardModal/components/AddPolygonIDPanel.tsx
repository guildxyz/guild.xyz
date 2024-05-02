import useGuild from "components/[guild]/hooks/useGuild"
import { AddRewardPanelProps } from "platforms/rewards"
import { useEffect } from "react"
import { PlatformType } from "types"

const AddPolygonIDPanel = ({ onAdd }: AddRewardPanelProps) => {
  const { id: guildId } = useGuild()

  useEffect(
    () =>
      onAdd({
        guildPlatform: {
          platformName: "POLYGON_ID",
          platformId: PlatformType.POLYGON_ID,
          platformGuildId: `polygonid-${guildId}`,
        },
        isNew: true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return null
}

export default AddPolygonIDPanel
