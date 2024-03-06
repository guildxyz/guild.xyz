import useGuild from "components/[guild]/hooks/useGuild"
import { AddPlatformPanelProps } from "platforms/platforms"
import { useEffect } from "react"
import { PlatformType } from "types"

const AddPolygonIDPanel = ({ onSuccess }: AddPlatformPanelProps) => {
  const { id: guildId } = useGuild()

  useEffect(
    () =>
      onSuccess({
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
