import { MenuItem, useDisclosure } from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import useGuild from "components/[guild]/hooks/useGuild"
import { PencilSimple } from "phosphor-react"
import PlatformCardMenu from "../../components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import EditSecretTextModal from "./EditSecretTextModal"

type Props = {
  platformGuildId: string
}

const SecretTextCardMenu = ({ platformGuildId }: Props): JSX.Element => {
  const { guildPlatforms } = useGuild()
  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.platformGuildId === platformGuildId
  )

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<PencilSimple />} onClick={onOpen}>
          Edit secret
        </MenuItem>
        <RemovePlatformMenuItem platformGuildId={platformGuildId} />
      </PlatformCardMenu>

      <EditSecretTextModal
        isOpen={isOpen}
        onClose={onClose}
        guildPlatformId={guildPlatform?.id}
        platformGuildData={guildPlatform?.platformGuildData}
      />
    </>
  )
}

export default SecretTextCardMenu
