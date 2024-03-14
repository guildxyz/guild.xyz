import rewards from "platforms/rewards"
import PlatformPreview from "./PlatformPreview"

const PolygonIDPreview = (): JSX.Element => (
  <PlatformPreview type="POLYGON_ID" image={rewards.POLYGON_ID.imageUrl} />
)

export default PolygonIDPreview
