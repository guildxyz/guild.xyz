import { MenuItem, useDisclosure } from "@chakra-ui/react"
import { PencilSimple } from "@phosphor-icons/react"
import EditRewardAvailabilityMenuItem from "components/[guild]/AccessHub/components/EditRewardAvailabilityMenuItem"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import EditNFTDescriptionModal from "components/[guild]/RoleCard/components/EditNFTDescriptionModal"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import useGuild from "components/[guild]/hooks/useGuild"

type Props = {
  platformGuildId: string
}

const ContractCallCardMenu = ({ platformGuildId }: Props): JSX.Element => {
  const { guildPlatforms } = useGuild()
  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.platformGuildId === platformGuildId
  )

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<PencilSimple />} onClick={onOpen}>
          Edit NFT description
        </MenuItem>
        <EditRewardAvailabilityMenuItem platformGuildId={platformGuildId} />
        <RemovePlatformMenuItem platformGuildId={platformGuildId} />
      </PlatformCardMenu>

      <EditNFTDescriptionModal
        isOpen={isOpen}
        onClose={onClose}
        guildPlatform={guildPlatform}
      />
    </>
  )
}

export default ContractCallCardMenu
