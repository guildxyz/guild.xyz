import { MenuItem, useDisclosure } from "@chakra-ui/react"
import { PencilSimple } from "@phosphor-icons/react/PencilSimple"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import useGuild from "components/[guild]/hooks/useGuild"
import EditPointsModal from "./EditPointsModal"

type Props = {
  platformGuildId: string
}

const PointsCardMenu = ({ platformGuildId }: Props): JSX.Element => {
  const { guildPlatforms } = useGuild()
  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.platformGuildId === platformGuildId
  )

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<PencilSimple />} onClick={onOpen}>
          Edit points
        </MenuItem>
        <RemovePlatformMenuItem platformGuildId={platformGuildId} />
      </PlatformCardMenu>

      <EditPointsModal
        isOpen={isOpen}
        onClose={onClose}
        guildPlatformId={guildPlatform?.id}
        platformGuildData={guildPlatform?.platformGuildData}
      />
    </>
  )
}

export default PointsCardMenu
