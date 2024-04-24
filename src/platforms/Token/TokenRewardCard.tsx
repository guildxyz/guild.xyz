import {
  Circle,
  Img,
  MenuItem,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import RewardCard from "components/common/RewardCard"
import useMembership from "components/explorer/hooks/useMembership"
import useToast from "hooks/useToast"
import { Coin, Pencil, Wallet } from "phosphor-react"
import rewards from "platforms/rewards"
import { GuildPlatform } from "types"
import EditTokenModal from "./EditTokenModal"
import FundPoolModal from "./FundPoolModal"
import TokenCardButton from "./TokenCardButton"
import { TokenRewardProvider, useTokenRewardContext } from "./TokenRewardContext"
import WithdrawPoolModal from "./WithdrawPoolModal"
import { useCalculateClaimableTokens } from "./hooks/useCalculateToken"
import useClaimedAmount from "./hooks/useTokenClaimedAmount"

const TokenRewardCard = () => {
  const { isAdmin } = useGuildPermission()
  const { token, guildPlatform, imageUrl } = useTokenRewardContext()

  const { getValue } = useCalculateClaimableTokens(guildPlatform)
  const claimableAmount = getValue()

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

  const { roles } = useGuild()

  const { roleIds } = useMembership()

  const rolePlatformIds = roles
    ?.flatMap((role) => role.rolePlatforms)
    ?.filter(
      (rp) =>
        rp?.guildPlatformId === guildPlatform.id ||
        rp?.guildPlatform?.id === guildPlatform.id
    )
    .filter((rp) => roleIds?.includes(rp.roleId) || false)
    .map((rp) => rp.id)

  const { data } = useClaimedAmount(
    guildPlatform.platformGuildData.chain,
    guildPlatform.platformGuildData.poolId,
    rolePlatformIds,
    token.data.decimals
  )
  const alreadyClaimed = data?.reduce((acc, res) => acc + res) || 0

  const bgColor = useColorModeValue("gray.700", "gray.600")

  const title = token.isLoading
    ? null
    : claimableAmount > 0
    ? `Claim ${claimableAmount} ${token.data.symbol}`
    : `Claimed ${alreadyClaimed} ${token.data.symbol}`

  const toast = useToast()

  return (
    <>
      <RewardCard
        label={rewards.ERC20.name}
        title={title}
        colorScheme={"gold"}
        image={
          imageUrl.match("guildLogos") ? (
            <Circle size={10} bgColor={bgColor}>
              <Img src={imageUrl} alt="Guild logo" boxSize="40%" />
            </Circle>
          ) : (
            imageUrl
          )
        }
        description={
          <>
            <Text fontSize="sm" color="GrayText">
              {alreadyClaimed === 0
                ? ``
                : claimableAmount > 0
                ? `Already claimed: ${alreadyClaimed} ${token.data.symbol}`
                : `You have claimed all of your ${token.data.symbol} rewards`}
            </Text>
            {/* TODO: This will not work if multiple rewards are set */}
            <AvailabilityTags
              mt={1}
              rolePlatform={roles
                .flatMap((role) => role.rolePlatforms)
                .find((rp) => rp.id === rolePlatformIds[0])}
            />
          </>
        }
        cornerButton={
          isAdmin && (
            <>
              <PlatformCardMenu>
                <MenuItem icon={<Pencil />} onClick={editOnOpen}>
                  Edit
                </MenuItem>
                <MenuItem icon={<Coin />} onClick={fundOnOpen}>
                  Fund pool
                </MenuItem>
                <MenuItem icon={<Wallet />} onClick={withdrawOnOpen}>
                  Withdraw from pool
                </MenuItem>
                <RemovePlatformMenuItem
                  platformGuildId={guildPlatform.platformGuildId}
                />
              </PlatformCardMenu>
            </>
          )
        }
      >
        <TokenCardButton isDisabled={claimableAmount <= 0} />
      </RewardCard>

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

const TokenRewardCardWrapper = ({ platform }: { platform: GuildPlatform }) => (
  <TokenRewardProvider guildPlatform={platform}>
    <TokenRewardCard />
  </TokenRewardProvider>
)

export { TokenRewardCardWrapper as TokenRewardCard }
