import { MenuItem, useDisclosure } from "@chakra-ui/react"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import useGuild from "components/[guild]/hooks/useGuild"
import { PencilSimple } from "phosphor-react"

type Props = {
  platformGuildId: string
}

const GatherCardMenu = ({ platformGuildId }: Props): JSX.Element => {
  const { guildPlatforms } = useGuild()
  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.platformGuildId === platformGuildId
  )

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<PencilSimple />} onClick={onOpen}>
          Edit reward
        </MenuItem>
        {/* <RemovePlatformMenuItem platformGuildId={platformGuildId} /> */}
      </PlatformCardMenu>
    </>
  )
}

export default GatherCardMenu
