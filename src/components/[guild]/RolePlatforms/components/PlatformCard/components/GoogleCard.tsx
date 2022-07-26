import { Platform } from "types"
import PlatformCard from "../PlatformCard"

type Props = {
  guildPlatform: Platform
  cornerButton: JSX.Element
}

const GoogleCard = ({ guildPlatform, cornerButton }: Props): JSX.Element => (
  <PlatformCard
    type="GOOGLE"
    imageUrl="/platforms/google.png"
    name={guildPlatform.platformGuildName}
    cornerButton={cornerButton}
  />
)

export default GoogleCard
