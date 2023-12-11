import platforms from "platforms/platforms"
import { useWatch } from "react-hook-form"
import PlatformPreview from "./PlatformPreview"

const PolygonIDPreview = (): JSX.Element => {
  const platformGuildData = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData",
  })

  return (
    <PlatformPreview
      type="POLYGON_ID"
      name={platformGuildData?.name ?? "PolygonID"}
      image={platformGuildData?.imageUrl ?? platforms.POLYGON_ID.imageUrl}
    />
  )
}

export default PolygonIDPreview
