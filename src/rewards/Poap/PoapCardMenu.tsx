import { MenuItem, useDisclosure } from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import useGuild from "components/[guild]/hooks/useGuild"
import { PiUploadSimple } from "react-icons/pi"
import UploadMintLinksModal from "./UploadMintLinksModal"

type Props = {
  platformGuildId: string
}

const PoapCardMenu = ({ platformGuildId }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { guildPlatforms } = useGuild()
  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.platformGuildId === platformGuildId
  )

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<PiUploadSimple />} onClick={onOpen}>
          Upload mint links
        </MenuItem>

        <RemovePlatformMenuItem platformGuildId={platformGuildId} />
      </PlatformCardMenu>

      <UploadMintLinksModal
        isOpen={isOpen}
        onClose={onClose}
        guildPlatformId={guildPlatform?.id}
      />
    </>
  )
}

export default PoapCardMenu
