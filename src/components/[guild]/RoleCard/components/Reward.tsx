import {
  Circle,
  HStack,
  Icon,
  Img,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import usePlatformAccessButton from "components/[guild]/AccessHub/components/usePlatformAccessButton"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import Visibility from "components/[guild]/Visibility"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/hooks/useIsMember"
import Button from "components/common/Button"
import { Transition, motion } from "framer-motion"
import { ArrowSquareOut, LockSimple } from "phosphor-react"
import GoogleCardWarning from "platforms/Google/GoogleCardWarning"
import platforms from "platforms/platforms"
import { ReactNode, useMemo } from "react"
import { GuildPlatform, PlatformType, Role, RolePlatform } from "types"
import capitalize from "utils/capitalize"
import { useAccount } from "wagmi"

export type RewardProps = {
  role: Role // should change to just roleId when we won't need memberCount anymore
  platform: RolePlatform
  withLink?: boolean
  withMotionImg?: boolean
  isLinkColorful?: boolean
}

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

const Reward = ({
  role,
  platform,
  withLink,
  withMotionImg = false,
  isLinkColorful,
}: RewardProps) => {
  const isMember = useIsMember()
  const { address } = useAccount()
  const openJoinModal = useOpenJoinModal()

  const { hasAccess, isValidating } = useAccess(role.id)
  const { label, ...accessButtonProps } = usePlatformAccessButton(
    platform.guildPlatform
  )

  const state = useMemo(() => {
    if (isMember && hasAccess)
      return {
        tooltipLabel: label,
        buttonProps: isLinkColorful
          ? { ...accessButtonProps, colorScheme: "blue" }
          : accessButtonProps,
      }
    if (!address || (!isMember && hasAccess))
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
  }, [isMember, hasAccess, address, accessButtonProps, isLinkColorful])

  return (
    <RewardDisplay
      icon={
        <RewardIcon
          rolePlatformId={platform.id}
          guildPlatform={platform?.guildPlatform}
          withMotionImg={withMotionImg}
        />
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
                {platform.guildPlatform?.platformGuildName ||
                  platform.guildPlatform?.platformGuildId}
              </Button>
            </Tooltip>
          ) : (
            <Text as="span" fontWeight="bold">
              {platform.guildPlatform?.platformGuildName ||
                platform.guildPlatform?.platformGuildId}
            </Text>
          )}
        </>
      }
      rightElement={
        <>
          <Visibility entityVisibility={platform.visibility} />

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

const RewardDisplay = ({
  icon,
  label,
  rightElement,
}: {
  icon?: ReactNode
  label: ReactNode
  rightElement?: ReactNode
}) => (
  <HStack pt="3" spacing={0} alignItems={"flex-start"}>
    {icon}

    <Text px="2" maxW="calc(100% - var(--chakra-sizes-12))">
      {label}
    </Text>
    {rightElement}
  </HStack>
)

export type RewardIconProps = {
  rolePlatformId: number
  guildPlatform?: GuildPlatform
  withMotionImg?: boolean
  transition?: Transition
}

const MotionImg = motion(Img)
const MotionCircle = motion(Circle)

const RewardIcon = ({
  rolePlatformId,
  guildPlatform,
  withMotionImg = true,
  transition,
}: RewardIconProps) => {
  const circleBgColor = useColorModeValue("gray.700", "gray.600")

  const props = {
    src:
      guildPlatform?.platformGuildData?.imageUrl ??
      platforms[PlatformType[guildPlatform?.platformId]].imageUrl,
    alt: guildPlatform?.platformGuildName,
    boxSize: 6,
    rounded: "full",
  }

  const circleProps = {
    bgColor: circleBgColor,
    boxSize: 6,
  }

  const motionElementProps = {
    layoutId: `${rolePlatformId}_reward_img`,
    transition: { type: "spring", duration: 0.5, ...transition },
  }

  if (!props.src) {
    if (withMotionImg)
      return (
        <MotionCircle {...motionElementProps} {...circleProps}>
          <Icon
            as={platforms[PlatformType[guildPlatform?.platformId]].icon}
            color="white"
            boxSize={3}
          />
        </MotionCircle>
      )

    return (
      <Circle {...circleProps}>
        <Icon
          as={platforms[PlatformType[guildPlatform?.platformId]].icon}
          color="white"
          boxSize={3}
        />
      </Circle>
    )
  }

  if (withMotionImg) return <MotionImg {...motionElementProps} {...props} />

  return <Img {...props} />
}

const RewardWrapper = ({ platform, ...props }: RewardProps) => {
  const { guildPlatforms } = useGuild()

  const guildPlatform = guildPlatforms?.find(
    (p) => p.id === platform.guildPlatformId
  )

  if (!guildPlatform) return null

  const platformWithGuildPlatform = { ...platform, guildPlatform }

  const Component =
    platforms[PlatformType[guildPlatform?.platformId]].RoleCardComponent ?? Reward

  return <Component platform={platformWithGuildPlatform} {...props} />
}

export { RewardDisplay, RewardIcon }
export default RewardWrapper
