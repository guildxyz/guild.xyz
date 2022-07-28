import { PropsWithChildren } from "react"
import { Platform } from "types"
import PlatformCard from "../PlatformCard"

type Props = {
  guildPlatform: Platform
  cornerButton: JSX.Element
}

const GoogleCard = ({
  guildPlatform,
  cornerButton,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <PlatformCard
    type="GOOGLE"
    imageUrl="/platforms/google.png"
    name={guildPlatform.platformGuildName}
    cornerButton={cornerButton}
  >
    {children}
  </PlatformCard>
)

export default GoogleCard
