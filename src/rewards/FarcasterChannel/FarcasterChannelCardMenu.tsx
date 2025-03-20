import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"

const FarcasterChannelCardMenu = ({
  platformGuildId,
}: { platformGuildId: string }) => {
  return (
    <PlatformCardMenu>
      <RemovePlatformMenuItem platformGuildId={platformGuildId} />
    </PlatformCardMenu>
  )
}
export { FarcasterChannelCardMenu }
