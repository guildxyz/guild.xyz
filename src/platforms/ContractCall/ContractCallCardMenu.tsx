import { MenuItem, useDisclosure } from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import useGuild from "components/[guild]/hooks/useGuild"
import { PencilSimple } from "phosphor-react"
import EditNFTDescriptionModal from "./components/EditNFTDescriptionModal"
import EditNftModal from "./components/EditNftModal"

type Props = {
  platformGuildId: string
}

const ContractCallCardMenu = ({ platformGuildId }: Props): JSX.Element => {
  const { guildPlatforms } = useGuild()
  const guildPlatform = guildPlatforms?.find(
    (gp) => gp.platformGuildId === platformGuildId
  )

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: legacyIsOpen,
    onOpen: legacyOnOpen,
    onClose: legacyOnClose,
  } = useDisclosure()

  const isLegacy =
    guildPlatform.platformGuildData.function ===
    ContractCallFunction.DEPRECATED_SIMPLE_CLAIM

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<PencilSimple />} onClick={isLegacy ? legacyOnOpen : onOpen}>
          {isLegacy ? "Edit NFT description" : "Edit NFT"}
        </MenuItem>
        <RemovePlatformMenuItem platformGuildId={platformGuildId} />
      </PlatformCardMenu>

      {isLegacy ? (
        <EditNFTDescriptionModal
          isOpen={legacyIsOpen}
          onClose={legacyOnClose}
          guildPlatform={guildPlatform}
        />
      ) : (
        <EditNftModal
          isOpen={isOpen}
          onClose={onClose}
          guildPlatform={guildPlatform}
        />
      )}
    </>
  )
}

export default ContractCallCardMenu
