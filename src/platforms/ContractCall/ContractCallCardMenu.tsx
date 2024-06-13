import { MenuItem, useDisclosure } from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
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
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    guildPlatform.platformGuildData.function ===
    ContractCallFunction.DEPRECATED_SIMPLE_CLAIM

  const { isAdmin } = useGuildPermission()
  const { creator } = useNftDetails(
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    guildPlatform.platformGuildData.chain,
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    guildPlatform.platformGuildData.contractAddress
  )
  const { address: userAddress } = useWeb3ConnectionManager()
  const isNFTCreator =
    isAdmin && creator?.toLowerCase() === userAddress?.toLowerCase()

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  if (!isNFTCreator) return null

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
          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          guildPlatform={guildPlatform}
        />
      ) : (
        <EditNftModal
          isOpen={isOpen}
          onClose={onClose}
          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          guildPlatform={guildPlatform}
        />
      )}
    </>
  )
}

export default ContractCallCardMenu
