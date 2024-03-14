import useGuild from "components/[guild]/hooks/useGuild"
import { AddPlatformPanelProps } from "platforms/rewards"
import { useEffect } from "react"
import { PlatformType } from "types"

const AddPolygonIDPanel = ({ onAdd }: AddPlatformPanelProps) => {
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
    []
  )

  return null
}

export default AddPolygonIDPanel
