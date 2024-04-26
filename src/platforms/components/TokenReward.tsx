import { Flex, Icon, Spinner, Tooltip, Wrap, useDisclosure } from "@chakra-ui/react"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Button from "components/common/Button"
import useMembership, {
  useRoleMembership,
} from "components/explorer/hooks/useMembership"
import { ArrowSquareIn, LockSimple } from "phosphor-react"
import ClaimTokenButton from "platforms/Token/ClaimTokenButton"
import ClaimTokenModal from "platforms/Token/ClaimTokenModal"
import DynamicTag from "platforms/Token/DynamicTag"
import { useIsFromGeogatedCountry } from "platforms/Token/GeogatedCountryAlert"
import PoolTag from "platforms/Token/PoolTag"
import {
  TokenRewardProvider,
  useTokenRewardContext,
} from "platforms/Token/TokenRewardContext"
import { useClaimableTokensForRolePlatform } from "platforms/Token/hooks/useCalculateToken"
import { useMemo } from "react"
import { RolePlatform } from "types"

const TokenReward = ({ rolePlatform }: { rolePlatform: RolePlatform }) => {
  const { imageUrl, token } = useTokenRewardContext()
  const claimableAmount = useClaimableTokensForRolePlatform(rolePlatform)
  const { isAdmin } = useGuildPermission()
  const { hasRoleAccess } = useRoleMembership(rolePlatform.roleId)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isMember } = useMembership()
  const isFromGeogatedCountry = useIsFromGeogatedCountry()
  const openJoinModal = useOpenJoinModal()

  const state = useMemo(() => {
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
  }, [hasRoleAccess, isMember, openJoinModal])

  return (
    <Flex alignItems={"center"} gap={1} wrap={"wrap"} mt={2}>
      <RewardDisplay
        icon={
          token.isLoading ? (
            <Spinner boxSize={6} />
          ) : (
            <RewardIcon
              rolePlatformId={rolePlatform.id}
              guildPlatform={rolePlatform?.guildPlatform}
              owerwriteImg={imageUrl}
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
                {...state.buttonProps}
              >
                {claimableAmount || ""} {token?.data?.symbol || "tokens"}
              </state.ButtonComponent>
            </Tooltip>
          </>
        }
        whiteSpace={"nowrap"}
        pt={0}
        mr={2}
      >
        <Wrap spacing={1}>
          <DynamicTag />
          <AvailabilityTags rolePlatform={rolePlatform} />
          {isAdmin && (
            <PoolTag
              poolId={BigInt(rolePlatform.guildPlatform.platformGuildData.poolId)}
            />
          )}
        </Wrap>
      </RewardDisplay>

      <ClaimTokenModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  )
}

const TokenRewardWrapper = ({ platform }: RewardProps) => (
  <TokenRewardProvider guildPlatform={platform.guildPlatform}>
    <TokenReward rolePlatform={platform} />
  </TokenRewardProvider>
)

export default TokenRewardWrapper
