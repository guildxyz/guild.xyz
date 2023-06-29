import {
  Circle,
  HStack,
  Icon,
  Img,
  SkeletonCircle,
  SkeletonProps,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import usePlatformAccessButton from "components/[guild]/AccessHub/components/usePlatformAccessButton"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/hooks/useIsMember"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import Visibility from "components/[guild]/Visibility"
import { motion, Transition } from "framer-motion"
import { ArrowSquareOut, LockSimple } from "phosphor-react"
import GoogleCardWarning from "platforms/Google/GoogleCardWarning"
import { forwardRef, ReactNode, useMemo } from "react"
import { GuildPlatform, PlatformType, Role, RolePlatform } from "types"
import capitalize from "utils/capitalize"
import ContractCallReward from "./components/ContractCallReward"

type Props = {
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
}: Props) => {
  const isMember = useIsMember()
  const { account } = useWeb3React()
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
  }, [isMember, hasAccess, account, accessButtonProps, isLinkColorful])

  if (platform.guildPlatform.platformId === PlatformType.CONTRACT_CALL)
    return <ContractCallReward platform={platform} withMotionImg={withMotionImg} />

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

const MotionSkeletonCircle = motion(
  forwardRef((props: SkeletonProps, ref: any) => (
    <Circle ref={ref} size={props.boxSize}>
      <SkeletonCircle {...props} />
    </Circle>
  ))
)
const MotionImg = motion(Img)

const RewardIcon = ({
  rolePlatformId,
  guildPlatform,
  isLoading,
  withMotionImg = true,
  transition,
}: {
  rolePlatformId: number
  guildPlatform?: GuildPlatform
  isLoading?: boolean
  withMotionImg?: boolean
  transition?: Transition
}) => {
  const { data: nftData } = useNftDetails(
    guildPlatform?.platformGuildData?.chain,
    guildPlatform?.platformGuildData?.contractAddress
  )

  const props = {
    src:
      nftData?.image ??
      `/platforms/${PlatformType[guildPlatform?.platformId]?.toLowerCase()}.png`,
    alt: guildPlatform?.platformGuildName,
    boxSize: 6,
  }

  if (withMotionImg)
    return isLoading || !props.src ? (
      <MotionSkeletonCircle boxSize={6} />
    ) : (
      <MotionImg
        layoutId={`${rolePlatformId}_reward_img`}
        transition={{ type: "spring", duration: 0.5, ...transition }}
        {...props}
      />
    )

  return <Img {...props} />
}

const RewardWrapper = ({ platform, ...props }: Props) => {
  const { guildPlatforms } = useGuild()

  const guildPlatform = guildPlatforms?.find(
    (p) => p.id === platform.guildPlatformId
  )

  if (!guildPlatform) return null

  const platformWithGuildPlatform = { ...platform, guildPlatform }

  return <Reward platform={platformWithGuildPlatform} {...props} />
}

export { RewardDisplay, RewardIcon }
export default RewardWrapper
