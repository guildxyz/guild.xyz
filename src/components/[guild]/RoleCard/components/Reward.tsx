import {
  Circle,
  Icon,
  Img,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { ArrowSquareOut, LockSimple } from "@phosphor-icons/react"
import usePlatformAccessButton from "components/[guild]/AccessHub/components/usePlatformAccessButton"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { ApiRequirementHandlerProvider } from "components/[guild]/RequirementHandlerContext"
import Visibility from "components/[guild]/Visibility"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import useMembership, {
  useRoleMembership,
} from "components/explorer/hooks/useMembership"
import { useMemo, useState } from "react"
import rewards from "rewards"
import GoogleCardWarning from "rewards/Google/GoogleCardWarning"
import rewardComponents from "rewards/components"
import { PlatformType, RolePlatform } from "types"
import capitalize from "utils/capitalize"
import { RewardDisplay } from "./RewardDisplay"
import { RewardIconProps, RewardProps } from "./types"

const getRewardLabel = (platform: RolePlatform) => {
  switch (platform.guildPlatform.platformId) {
    case PlatformType.DISCORD:
      return "Role in: "

    case PlatformType.GOOGLE:
      return `${capitalize(platform.platformRoleId ?? "reader")} access to: `

    default:
      return "Access to: "
  }
}

const Reward = ({ role, platform, withLink, isLinkColorful }: RewardProps) => {
  const { isMember } = useMembership()
  const openJoinModal = useOpenJoinModal()

  const { hasRoleAccess, isValidating } = useRoleMembership(role.id)
  const { label, ...accessButtonProps } = usePlatformAccessButton(
    platform.guildPlatform
  )

  const state = useMemo(() => {
    if (hasRoleAccess)
      return {
        tooltipLabel: label,
        buttonProps: isLinkColorful
          ? { ...accessButtonProps, colorScheme: "blue" }
          : accessButtonProps,
      }

    if (!isMember)
      return {
        tooltipLabel: (
          <>
            <Icon as={LockSimple} display="inline" mb="-2px" mr="1" />
            Join guild to check access
          </>
        ),
        buttonProps: { onClick: openJoinModal },
      }

    return {
      tooltipLabel: "You don't satisfy the requirements to this role",
      buttonProps: { isDisabled: true },
    }
  }, [
    hasRoleAccess,
    label,
    isLinkColorful,
    accessButtonProps,
    isMember,
    openJoinModal,
  ])

  const name =
    platform.guildPlatform?.platformGuildName ||
    platform.guildPlatform?.platformGuildData?.name ||
    platform.guildPlatform?.platformGuildId

  return (
    <RewardDisplay
      icon={
        platform.guildPlatform && (
          <RewardIcon
            rolePlatformId={platform.id}
            guildPlatform={platform.guildPlatform}
          />
        )
      }
      label={
        <>
          {getRewardLabel(platform)}
          {withLink ? (
            <Tooltip label={state.tooltipLabel} hasArrow>
              <Button
                variant="link"
                rightIcon={
                  isValidating ? <Spinner boxSize="1em" /> : <ArrowSquareOut />
                }
                iconSpacing="1"
                maxW="full"
                {...state.buttonProps}
              >
                {name}
              </Button>
            </Tooltip>
          ) : (
            <Text as="span" fontWeight="bold">
              {name}
            </Text>
          )}
        </>
      }
      rightElement={
        <>
          <Visibility
            visibilityRoleId={platform.visibilityRoleId}
            entityVisibility={platform.visibility}
          />

          {platform.guildPlatform?.platformId === PlatformType.GOOGLE && (
            <GoogleCardWarning
              guildPlatform={platform.guildPlatform}
              roleMemberCount={role.memberCount}
              size="sm"
            />
          )}
        </>
      }
    />
  )
}

const RewardIcon = ({
  rolePlatformId,
  guildPlatform,
  transition,
}: RewardIconProps) => {
  const [doIconFallback, setDoIconFallback] = useState(false)
  const props = {
    src:
      guildPlatform.platformGuildData?.imageUrl ??
      rewards[PlatformType[guildPlatform.platformId]].imageUrl,
    alt: guildPlatform.platformGuildName,
    boxSize: 6,
    rounded: "full",
    onError: () => {
      setDoIconFallback(true)
    },
  }

  const circleBgColor = useColorModeValue("gray.700", "gray.600")
  const circleProps = {
    bgColor: circleBgColor,
    boxSize: 6,
  }

  if (doIconFallback || !props.src) {
    return (
      <Circle {...circleProps}>
        <Icon
          as={rewards[PlatformType[guildPlatform.platformId]].icon}
          color="white"
          boxSize={3}
        />
      </Circle>
    )
  }

  return (
    <Circle as="picture">
      <source srcSet={rewards[PlatformType[guildPlatform.platformId]].imageUrl} />
      <Img {...props} />
    </Circle>
  )
}

const RewardWrapper = ({ platform, ...props }: RewardProps) => {
  const { guildPlatforms } = useGuild()

  const guildPlatform = guildPlatforms?.find(
    (p) => p.id === platform.guildPlatformId
  )

  if (!guildPlatform) return null

  const platformWithGuildPlatform = { ...platform, guildPlatform }

  const Component =
    rewardComponents[PlatformType[guildPlatform?.platformId]].SmallRewardPreview ??
    Reward

  return (
    <ApiRequirementHandlerProvider roleId={platformWithGuildPlatform.roleId}>
      <Component platform={platformWithGuildPlatform} {...props} />
    </ApiRequirementHandlerProvider>
  )
}

export { Reward, RewardIcon, getRewardLabel }
export default RewardWrapper
