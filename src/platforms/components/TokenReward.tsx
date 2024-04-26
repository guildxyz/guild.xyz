import { Flex, Icon, Spinner, Tooltip, Wrap, useDisclosure } from "@chakra-ui/react"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Button from "components/common/Button"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { ArrowSquareIn } from "phosphor-react"
import ClaimTokenModal from "platforms/Token/ClaimTokenModal"
import DynamicTag from "platforms/Token/DynamicTag"
import PoolTag from "platforms/Token/PoolTag"
import {
  TokenRewardProvider,
  useTokenRewardContext,
} from "platforms/Token/TokenRewardContext"
import { useClaimableTokensForRolePlatform } from "platforms/Token/hooks/useCalculateToken"
import { RolePlatform } from "types"

const TokenReward = ({ rolePlatform }: { rolePlatform: RolePlatform }) => {
  const { imageUrl, token } = useTokenRewardContext()
  const claimableAmount = useClaimableTokensForRolePlatform(rolePlatform)
  const { isAdmin } = useGuildPermission()
  const { hasRoleAccess } = useRoleMembership(rolePlatform.roleId)
  const { isOpen, onOpen, onClose } = useDisclosure()

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
        label={
          <>
            {`Claim: `}
            <Tooltip
              label={
                !hasRoleAccess ? (
                  `You will be able to claim these tokens if you satisfy the requirements for this role.`
                ) : (
                  <>
                    Claim reward <Icon as={ArrowSquareIn} mb="-0.5" />
                  </>
                )
              }
              shouldWrapChildren
              hasArrow
            >
              <Button
                variant="link"
                onClick={() => onOpen()}
                isDisabled={!hasRoleAccess}
                rightIcon={<ArrowSquareIn />}
                iconSpacing="1"
              >
                {claimableAmount || ""} {token?.data?.symbol || "tokens"}
              </Button>
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
