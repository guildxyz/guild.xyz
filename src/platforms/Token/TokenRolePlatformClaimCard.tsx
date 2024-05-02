import { HStack, Heading, Stack, Text, useColorMode } from "@chakra-ui/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useGuild from "components/[guild]/hooks/useGuild"
import useRole from "components/[guild]/hooks/useRole"
import Button from "components/common/Button"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import useMembership from "components/explorer/hooks/useMembership"
import { useMemo } from "react"
import { RolePlatform } from "types"
import { useTokenRewardContext } from "./TokenRewardContext"

import { useClaimableTokensForRolePlatform } from "./hooks/useCalculateToken"
import useCollectToken from "./hooks/useCollectToken"

const TokenRolePlatformClaimCard = ({
  rolePlatform,
}: {
  rolePlatform: RolePlatform
}) => {
  const { guildPlatform, token } = useTokenRewardContext()
  const claimableAmount = useClaimableTokensForRolePlatform(rolePlatform)

  const { roleIds } = useMembership()

  const {
    onSubmit,
    isLoading: isClaiming,
    loadingText: claimLoadingText,
  } = useCollectToken(
    guildPlatform.platformGuildData.chain,
    rolePlatform.roleId,
    rolePlatform.id
  )

  const { triggerMembershipUpdate: submitClaim, isLoading: membershipLoading } =
    useMembershipUpdate({
      onSuccess: () => {
        onSubmit()
      },
      onError: (error) => {
        console.error(error)
      },
    })

  const claimLoading = useMemo(
    () =>
      membershipLoading
        ? "Checking access..."
        : claimLoadingText
        ? claimLoadingText
        : null,
    [membershipLoading, claimLoadingText]
  )

  const { id: guildId } = useGuild()

  const { imageUrl, name } = useRole(guildId, rolePlatform.roleId)

  const { colorMode } = useColorMode()

  const hasAccess = roleIds.includes(rolePlatform.roleId)

  return (
    <Card
      px={4}
      py={4}
      bg={colorMode === "light" ? "blackAlpha.100" : "blackAlpha.300"}
      boxShadow={"none"}
    >
      <HStack gap={3}>
        <GuildLogo
          imageUrl={imageUrl}
          size={{ base: "24px", md: "36px" }}
          opacity={hasAccess ? 1 : 0.5}
        />

        <Stack gap={0} opacity={hasAccess ? 1 : 0.5}>
          <Text fontSize="sm" color="GrayText">
            {name}
          </Text>
          <Heading fontSize={"md"}>
            {" "}
            {claimableAmount} {token.data.symbol}{" "}
          </Heading>
        </Stack>

        {hasAccess ? (
          <Button
            size="sm"
            ml="auto"
            colorScheme="gold"
            isDisabled={token.isLoading}
            isLoading={isClaiming}
            loadingText={claimLoading}
            onClick={() => {
              submitClaim({
                roleIds: [rolePlatform.roleId],
                saveClaimData: true,
              })
            }}
          >
            Claim
          </Button>
        ) : (
          <Button size="sm" ml="auto" colorScheme="gold" isDisabled={true}>
            No access
          </Button>
        )}
      </HStack>
    </Card>
  )
}

export default TokenRolePlatformClaimCard
