import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import PlatformCardMenu from "../../components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"

type Props = {
  platformGuildId: string
}

const UniqueTextCardMenu = ({ platformGuildId }: Props): JSX.Element => (
  <>
    <PlatformCardMenu>
      <RemovePlatformMenuItem platformGuildId={platformGuildId} />
    </PlatformCardMenu>

    {/* TODO: edit unique text reward modal */}
  </>
)

export default UniqueTextCardMenu
