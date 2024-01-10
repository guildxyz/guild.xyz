import EditRewardAvailabilityMenuItem from "components/[guild]/AccessHub/components/EditRewardAvailabilityMenuItem"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import PlatformCardMenu from "../../components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import EditRewardDescriptionModal from "../../components/[guild]/RoleCard/components/EditRewardDescription"
import { MenuItem, useDisclosure } from "@chakra-ui/react"
import useGuild from "../../components/[guild]/hooks/useGuild"
import { PencilSimple } from "phosphor-react"
import useGuildPermission from "../../components/[guild]/hooks/useGuildPermission"

type Props = {
  platformGuildId: string
}

const ContractCallCardMenu = ({ platformGuildId }: Props): JSX.Element => {
  const { guildPlatforms } = useGuild()
  const { isAdmin } = useGuildPermission()
  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.platformGuildId === platformGuildId
  )

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <PlatformCardMenu>
        {isAdmin && (
          <MenuItem icon={<PencilSimple />} onClick={onOpen}>
            Edit reward description
          </MenuItem>
        )}
        <EditRewardAvailabilityMenuItem platformGuildId={platformGuildId} />
        <RemovePlatformMenuItem platformGuildId={platformGuildId} />
      </PlatformCardMenu>

      {isAdmin && (
        <EditRewardDescriptionModal
          isOpen={isOpen}
          onClose={onClose}
          guildPlatform={guildPlatform}
        />
      )}
    </>
  )
}

export default ContractCallCardMenu
