import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import {
  MenuDivider,
  MenuItem,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import {
  Check,
  Coin,
  Copy,
  Pencil,
  TrashSimple,
  Wallet,
} from "@phosphor-icons/react"
import EditRewardAvailabilityMenuItem from "components/[guild]/AccessHub/components/EditRewardAvailabilityMenuItem"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import useToast from "hooks/useToast"
import { GuildPlatform } from "types"
import EditTokenModal from "./EditTokenModal"
import FundPoolModal from "./FundPoolModal"
import RemoveTokenRewardConfirmation from "./RemoveTokenRewardConfirmation"
import WithdrawPoolModal from "./WithdrawPoolModal"

const TokenRewardCardEditMenu = ({
  guildPlatform,
}: {
  guildPlatform: GuildPlatform
}) => {
  const {
    isOpen: fundIsOpen,
    onOpen: fundOnOpen,
    onClose: fundOnClose,
  } = useDisclosure()

  const {
    isOpen: withdrawIsOpen,
    onOpen: withdrawOnOpen,
    onClose: withdrawOnClose,
  } = useDisclosure()

  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onClose: editOnClose,
  } = useDisclosure()

  const { copyToClipboard, hasCopied } = useCopyToClipboard()

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure()

  const toast = useToast()

  const removeColor = useColorModeValue("red.600", "red.300")

  return (
    <>
      <PlatformCardMenu>
        <MenuItem icon={<Pencil />} onClick={editOnOpen}>
          Edit reward
        </MenuItem>
        <EditRewardAvailabilityMenuItem
          platformGuildId={guildPlatform.platformGuildId}
        />
        <MenuDivider />
        <MenuItem icon={<Coin />} onClick={fundOnOpen}>
          Fund pool
        </MenuItem>
        <MenuItem icon={<Wallet />} onClick={withdrawOnOpen}>
          Withdraw from pool
        </MenuItem>
        <MenuItem
          icon={hasCopied ? <Check /> : <Copy />}
          onClick={() =>
            copyToClipboard(
              guildPlatform.platformGuildData?.poolId?.toString() ?? "Unknown pool"
            )
          }
        >
          Copy pool ID
        </MenuItem>
        <MenuDivider />
        <MenuItem icon={<TrashSimple />} onClick={deleteOnOpen} color={removeColor}>
          Remove reward
        </MenuItem>
      </PlatformCardMenu>

      <RemoveTokenRewardConfirmation
        isOpen={deleteIsOpen}
        onClose={deleteOnClose}
        guildPlatform={guildPlatform}
      />

      <WithdrawPoolModal
        isOpen={withdrawIsOpen}
        onClose={withdrawOnClose}
        onSuccess={() => {}}
      />

      <FundPoolModal
        onClose={fundOnClose}
        isOpen={fundIsOpen}
        onSuccess={() => {
          toast({
            status: "success",
            title: "Success",
            description: "Successfully funded the token pool!",
          })
          fundOnClose()
        }}
      />

      <EditTokenModal onClose={editOnClose} isOpen={editIsOpen} />
    </>
  )
}

export default TokenRewardCardEditMenu
