import { IconButton, useDisclosure } from "@chakra-ui/react"
import { ContractCallFunction } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { GearSix } from "phosphor-react"
import EditNftModal from "platforms/ContractCall/components/EditNftModal"
import { useCollectNftContext } from "./CollectNftContext"

const EditNftButton = () => {
  const { guildPlatform } = useCollectNftContext()
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const { textColor, buttonColorScheme } = useThemeContext()
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    guildPlatform.platformGuildData.function ===
    ContractCallFunction.DEPRECATED_SIMPLE_CLAIM
  )
    return null

  return (
    <>
      <IconButton
        icon={<GearSix />}
        aria-label="Edit NFT"
        size="sm"
        variant="ghost"
        colorScheme={buttonColorScheme}
        color={textColor}
        onClick={onOpen}
      />

      <EditNftModal
        isOpen={isOpen}
        onClose={onClose}
        guildPlatform={guildPlatform}
      />
    </>
  )
}
export default EditNftButton
