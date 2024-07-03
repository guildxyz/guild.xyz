import { MenuItem, useDisclosure } from "@chakra-ui/react"
import { PencilSimple } from "@phosphor-icons/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import EditNFTDescriptionModal from "./components/EditNFTDescriptionModal"
import EditNftModal from "./components/EditNftModal"
import { useRef } from "react"

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
  const ref = useRef(null)

  const isLegacy =
    guildPlatform.platformGuildData.function ===
    ContractCallFunction.DEPRECATED_SIMPLE_CLAIM

  const { isAdmin } = useGuildPermission()
  const { creator } = useNftDetails(
    guildPlatform.platformGuildData.chain,
    guildPlatform.platformGuildData.contractAddress
  )
  const { address: userAddress } = useWeb3ConnectionManager()
  const isNFTCreator =
    isAdmin && creator?.toLowerCase() === userAddress?.toLowerCase()

  if (!isNFTCreator) return null

  return (
    <>
      <PlatformCardMenu>
        <MenuItem
          icon={<PencilSimple />}
          onClick={isLegacy ? legacyOnOpen : onOpen}
          ref={ref}
        >
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
          finalFocusRef={ref}
          isOpen={isOpen}
          onClose={onClose}
          guildPlatform={guildPlatform}
        />
      )}
    </>
  )
}

export default ContractCallCardMenu
