import { MenuItem, useDisclosure } from "@chakra-ui/react"
import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import useGuild from "components/[guild]/hooks/useGuild"
import { PencilSimple } from "phosphor-react"
import EditNFTDescriptionModal from "./EditNFTDescriptionModal"
import EditNftModal from "./EditNftModal"

type Props = {
  platformGuildId: string
}

const EditNftMenuItem = ({ platformGuildId }: Props) => {
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
      <MenuItem icon={<PencilSimple />} onClick={isLegacy ? legacyOnOpen : onOpen}>
        {isLegacy ? "Edit NFT description" : "Edit NFT"}
      </MenuItem>

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

export default EditNftMenuItem
