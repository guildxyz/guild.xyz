import { HStack, Heading, Stack, Text, useColorMode } from "@chakra-ui/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useGuild from "components/[guild]/hooks/useGuild"
import useRole from "components/[guild]/hooks/useRole"
import Button from "components/common/Button"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import { useMemo } from "react"
import { RolePlatform } from "types"
import { useTokenRewardContext } from "./TokenRewardContext"
import { useCalculateFromDynamic } from "./hooks/useCalculateToken"
import useCollectToken from "./hooks/useCollectToken"

const TokenRolePlatformClaimCard = ({
  rolePlatform,
}: {
  rolePlatform: RolePlatform
}) => {
  const { guildPlatform, token } = useTokenRewardContext()
  const { getValue } = useCalculateFromDynamic(rolePlatform.dynamicAmount)

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

  const claimable = getValue()

  return (
    <Card
      px={4}
      py={4}
      bg={colorMode === "light" ? "blackAlpha.100" : "blackAlpha.300"}
      boxShadow={"none"}
    >
      <HStack gap={3}>
        <GuildLogo imageUrl={imageUrl} size={{ base: "24px", md: "36px" }} />

        <Stack gap={0}>
          <Text fontSize="sm" color="GrayText">
            {name}
          </Text>
          <Heading fontSize={"md"}>
            {" "}
            {claimable} {token.data.symbol}{" "}
          </Heading>
        </Stack>

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
      </HStack>
    </Card>
  )
}

export default TokenRolePlatformClaimCard
