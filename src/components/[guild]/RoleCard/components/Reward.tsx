import { Circle, HStack, Icon, Img, Text, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import usePlatformAccessButton from "components/[guild]/AccessHub/components/usePlatformAccessButton"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/hooks/useIsMember"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import GoogleCardWarning from "components/[guild]/RolePlatforms/components/PlatformCard/components/useGoogleCardProps/GoogleCardWarning"
import { ArrowSquareOut, LockSimple } from "phosphor-react"
import platforms, { platformIdToName } from "platforms"
import { useMemo } from "react"
import { Role, RolePlatform } from "types"
import capitalize from "utils/capitalize"

type Props = {
  role: Role // should change to just roleId when we won't need memberCount anymore
  platform: RolePlatform
}

const getRewardLabel = (platform: RolePlatform) => {
  switch (platform.guildPlatform.platformId) {
    case platforms.DISCORD.id:
      return "Role in: "

    case platforms.GOOGLE.id:
      return `${capitalize(platform.platformRoleData?.role ?? "reader")} access to: `

    default:
      return "Access to: "
  }
}

const Reward = ({ role, platform }: Props) => {
  const isMember = useIsMember()
  const { account } = useWeb3React()
  const openJoinModal = useOpenJoinModal()

  const { hasAccess } = useAccess(role.id)
  const { label, ...accessButtonProps } = usePlatformAccessButton(
    platform.guildPlatform
  )

  const state = useMemo(() => {
    if (isMember && hasAccess)
      return {
        tooltipLabel: label,
        buttonProps: accessButtonProps,
      }
    if (!account || (!isMember && hasAccess))
      return {
        tooltipLabel: (
          <>
            <Icon as={LockSimple} display="inline" mb="-2px" mr="1" />
            Join guild to get access
          </>
        ),
        buttonProps: { onClick: openJoinModal },
      }
    return {
      tooltipLabel: "You don't satisfy the requirements to this role",
      buttonProps: { isDisabled: true },
    }
  }, [isMember, hasAccess, account])

  return (
    <HStack pt="3" spacing={0} alignItems={"flex-start"}>
      <Circle size={6} overflow="hidden">
        <Img
          src={`/platforms/${platformIdToName[
            platform.guildPlatform?.platformId
          ]?.toLowerCase()}.png`}
          alt={platform.guildPlatform?.platformGuildName}
          boxSize={6}
        />
      </Circle>
      <Text px="2" maxW="calc(100% - var(--chakra-sizes-12))">
        {getRewardLabel(platform)}
        <Tooltip label={state.tooltipLabel} hasArrow>
          <Button
            variant="link"
            rightIcon={<ArrowSquareOut />}
            iconSpacing="1"
            {...state.buttonProps}
            maxW="full"
          >
            {platform.guildPlatform?.platformGuildName ||
              platform.guildPlatform?.platformGuildId}
          </Button>
        </Tooltip>
      </Text>

      {platform.guildPlatform?.platformId === platforms.GOOGLE.id && (
        <GoogleCardWarning
          guildPlatform={platform.guildPlatform}
          roleMemberCount={role.memberCount}
          size="sm"
        />
      )}
    </HStack>
  )
}

const RewardWrapper = ({ role, platform }: Props) => {
  const { guildPlatforms } = useGuild()

  const guildPlatform = guildPlatforms?.find(
    (p) => p.id === platform.guildPlatformId
  )

  if (!guildPlatform) return null

  const platformWithGuildPlatform = { ...platform, guildPlatform }

  return <Reward platform={platformWithGuildPlatform} role={role} />
}

export default RewardWrapper
