import { Icon, Spinner, Tooltip } from "@chakra-ui/react"
import { ArrowSquareIn, LockSimple } from "@phosphor-icons/react"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import DynamicTag from "components/[guild]/RoleCard/components/DynamicReward/DynamicTag"
import { RewardIcon } from "components/[guild]/RoleCard/components/Reward"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Button from "components/common/Button"
import useMembership, {
  useRoleMembership,
} from "components/explorer/hooks/useMembership"
import { useMemo } from "react"
import { claimTextButtonTooltipLabel } from "rewards/SecretText/TextCardButton"
import ClaimTokenButton from "rewards/Token/ClaimTokenButton"
import { useIsFromGeogatedCountry } from "rewards/Token/GeogatedCountryAlert"
import PoolTag from "rewards/Token/PoolTag"
import {
  TokenRewardProvider,
  useTokenRewardContext,
} from "rewards/Token/TokenRewardContext"
import { useClaimableTokensForRolePlatform } from "rewards/Token/hooks/useCalculateToken"
import { RolePlatform } from "types"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"
import { RewardProps } from "components/[guild]/RoleCard/components/types"
import { RewardDisplay } from "components/[guild]/RoleCard/components/RewardDisplay"

const TokenReward = ({ rolePlatform }: { rolePlatform: RolePlatform }) => {
  const { token } = useTokenRewardContext()
  const claimableAmount = useClaimableTokensForRolePlatform(rolePlatform)
  const { isAdmin } = useGuildPermission()
  const { hasRoleAccess } = useRoleMembership(rolePlatform.roleId)
  const { isMember } = useMembership()
  const isFromGeogatedCountry = useIsFromGeogatedCountry()
  const openJoinModal = useOpenJoinModal()

  const { isAvailable } = getRolePlatformTimeframeInfo(rolePlatform)

  const state = useMemo(() => {
    if (!isAvailable) {
      return {
        tooltipLabel:
          claimTextButtonTooltipLabel[getRolePlatformStatus(rolePlatform)],
        ButtonComponent: Button,
        buttonProps: { isDisabled: true },
      }
    }

    if (hasRoleAccess)
      return {
        tooltipLabel: !isFromGeogatedCountry && "Claim reward",
        ButtonComponent: ClaimTokenButton,
      }

    if (!isMember)
      return {
        tooltipLabel: (
          <>
            <Icon as={LockSimple} display="inline" mb="-2px" mr="1" />
            Join guild to check access
          </>
        ),
        ButtonComponent: Button,
        buttonProps: { onClick: openJoinModal },
      }

    return {
      tooltipLabel: "You don't satisfy the requirements to this role",
      ButtonComponent: Button,
      buttonProps: { isDisabled: true },
    }
  }, [hasRoleAccess, isMember, openJoinModal, isAvailable, rolePlatform])

  return (
    <RewardDisplay
      icon={
        token.isLoading ? (
          <Spinner boxSize={6} />
        ) : (
          <RewardIcon
            rolePlatformId={rolePlatform.id}
            guildPlatform={rolePlatform?.guildPlatform}
          />
        )
      }
      sx={{ "[id^='popover-trigger']": { display: "inline" } }} // needed so the button stays inline when there's no tooltipLabel too
      label={
        <>
          {`Claim: `}
          <Tooltip label={state.tooltipLabel} shouldWrapChildren hasArrow>
            <state.ButtonComponent
              colorScheme="gray"
              w="auto"
              variant="link"
              rightIcon={<ArrowSquareIn />}
              iconSpacing="1"
              rolePlatform={rolePlatform}
              {...state.buttonProps}
            >
              {claimableAmount || ""} {token?.data?.symbol || "tokens"}
            </state.ButtonComponent>
          </Tooltip>
        </>
      }
      whiteSpace={"nowrap"}
      rightElement={
        <>
          <DynamicTag rolePlatform={rolePlatform} />
          <AvailabilityTags rolePlatform={rolePlatform} />
          {isAdmin && (
            <PoolTag
              poolId={BigInt(rolePlatform.guildPlatform.platformGuildData.poolId)}
            />
          )}
        </>
      }
    />
  )
}

const TokenRewardWrapper = ({ platform }: RewardProps) => (
  <TokenRewardProvider guildPlatform={platform.guildPlatform}>
    <TokenReward rolePlatform={platform} />
  </TokenRewardProvider>
)

export default TokenRewardWrapper
