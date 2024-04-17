import {
  ChakraProps,
  Circle,
  HStack,
  Icon,
  Img,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import usePlatformAccessButton from "components/[guild]/AccessHub/components/usePlatformAccessButton"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import Visibility from "components/[guild]/Visibility"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import useMembership, {
  useRoleMembership,
} from "components/explorer/hooks/useMembership"
import { Transition, motion } from "framer-motion"
import { ArrowSquareOut, LockSimple } from "phosphor-react"
import GoogleCardWarning from "platforms/Google/GoogleCardWarning"
import rewards from "platforms/rewards"
import { PropsWithChildren, ReactNode, useMemo } from "react"
import { GuildPlatform, PlatformType, Role, RolePlatform } from "types"
import capitalize from "utils/capitalize"

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
            Join guild to get access
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

const RewardDisplay = ({
  icon,
  label,
  rightElement,
  children,
  ...chakraProps
}: PropsWithChildren<
  {
    icon?: ReactNode
    label: ReactNode
    rightElement?: ReactNode
  } & ChakraProps
>) => (
  <HStack pt="3" spacing={2} alignItems={"flex-start"} {...chakraProps}>
    {icon}

    <Stack w="full" spacing={0.5}>
      <HStack spacing={0}>
        <Text maxW="calc(100% - var(--chakra-sizes-12))">{label}</Text>
        {rightElement}
      </HStack>

      {children}
    </Stack>
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
      rewards[PlatformType[guildPlatform?.platformId]]?.imageUrl,
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
            as={rewards[PlatformType[guildPlatform?.platformId]]?.icon}
            color="white"
            boxSize={3}
          />
        </MotionCircle>
      )

    return (
      <Circle {...circleProps}>
        <Icon
          as={rewards[PlatformType[guildPlatform?.platformId]]?.icon}
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
    rewards[PlatformType[guildPlatform?.platformId]].RoleCardComponent ?? Reward

  return <Component platform={platformWithGuildPlatform} {...props} />
}

export { Reward, RewardDisplay, RewardIcon, getRewardLabel }
export default RewardWrapper
