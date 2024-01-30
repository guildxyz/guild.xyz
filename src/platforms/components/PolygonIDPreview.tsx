import platforms from "platforms/platforms"
import PlatformPreview from "./PlatformPreview"

const PolygonIDPreview = (): JSX.Element => (
  <PlatformPreview type="POLYGON_ID" image={platforms.POLYGON_ID.imageUrl} />
)

export default PolygonIDPreview
