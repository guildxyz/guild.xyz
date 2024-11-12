import { useDisclosure } from "@/hooks/useDisclosure"
import { MenuDivider, MenuItem, useColorModeValue } from "@chakra-ui/react"
import {
  ArrowSquareOut,
  ArrowsLeftRight,
  Coin,
  Pencil,
  TrashSimple,
  Wallet,
} from "@phosphor-icons/react"
import EditRewardAvailabilityMenuItem from "components/[guild]/AccessHub/components/EditRewardAvailabilityMenuItem"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import useToast from "hooks/useToast"
import dynamic from "next/dynamic"
import { useState } from "react"
import { GuildPlatform } from "types"
import { ERC20_SUPPORTED_CHAINS } from "utils/guildCheckout/constants"
import { useAccount } from "wagmi"
import EditTokenModal from "./EditTokenModal"
import FundPoolModal from "./FundPoolModal"
import { PoolDetailsDialog } from "./PoolDetailsDialog"
import RemoveTokenRewardConfirmation from "./RemoveTokenRewardConfirmation"
import WithdrawPoolModal from "./WithdrawPoolModal"
import usePool from "./hooks/usePool"

const DynamicTransferPoolOwnershipDialog = dynamic(() =>
  import("./TransferPoolOwnershipDialog").then(
    (module) => module.TransferPoolOwnershipDialog
  )
)

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

  const {
    onOpen: transferOwnershipOnOpen,
    isOpen: transferOwnershipIsOpen,
    setValue: transferOwnershipSetValue,
  } = useDisclosure()

  const {
    onOpen: poolDetailsOnOpen,
    isOpen: poolDetailsIsOpen,
    setValue: poolDetailsSetValue,
  } = useDisclosure()

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure()

  const toast = useToast()

  const removeColor = useColorModeValue("red.600", "red.300")

  const { address } = useAccount()
  const { data } = usePool(
    // TODO: should we use `guildPlatform.platformGuildData.contractAddress` here instead?
    guildPlatform.platformGuildData
      ?.chain as (typeof ERC20_SUPPORTED_CHAINS)[number],
    BigInt(guildPlatform.platformGuildData?.poolId ?? "0") // We'll never use this fallback, since poolId is defined at this point
  )

  const isPoolOwner = data?.owner?.toLowerCase() === address?.toLowerCase()

  const [shouldHideTransferButton, setShouldHideTransferButton] = useState(false)

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
        {isPoolOwner && !shouldHideTransferButton && (
          <MenuItem icon={<ArrowsLeftRight />} onClick={transferOwnershipOnOpen}>
            Transfer pool ownership
          </MenuItem>
        )}
        <MenuItem icon={<ArrowSquareOut />} onClick={poolDetailsOnOpen}>
          View pool details
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

      {isPoolOwner && (
        <DynamicTransferPoolOwnershipDialog
          open={transferOwnershipIsOpen}
          onOpenChange={transferOwnershipSetValue}
          /**
           * The proper way of doing this would be to wait for the TX receipt when transferring ownership, then mutate `usePool`'s data, but this will work too for now
           */
          onSuccess={() => setShouldHideTransferButton(true)}
        />
      )}

      <PoolDetailsDialog
        open={poolDetailsIsOpen}
        onOpenChange={poolDetailsSetValue}
      />
    </>
  )
}

export default TokenRewardCardEditMenu
