import { HStack, Icon, Img, Text, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import usePlatformAccessButton from "components/[guild]/AccessHub/components/usePlatformAccessButton"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/hooks/useIsMember"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import Visibility from "components/[guild]/Visibility"
import { motion } from "framer-motion"
import { ArrowSquareOut, LockSimple } from "phosphor-react"
import GoogleCardWarning from "platforms/Google/GoogleCardWarning"
import { ReactNode, useMemo } from "react"
import { PlatformType, Role, RolePlatform } from "types"
import capitalize from "utils/capitalize"

type Props = {
  role: Role // should change to just roleId when we won't need memberCount anymore
  platform: RolePlatform
  withLink?: boolean
}

const getRewardLabel = (platform: RolePlatform) => {
  switch (platform.guildPlatform.platformId) {
    case PlatformType.DISCORD:
      return "Role in: "

    case PlatformType.GOOGLE:
      return `${capitalize(platform.platformRoleData?.role ?? "reader")} access to: `

    default:
      return "Access to: "
  }
}

const Reward = ({ role, platform, withLink }: Props) => {
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
  }, [isMember, hasAccess, account, accessButtonProps])

  return (
    <RewardDisplay
      imgSrc={`/platforms/${PlatformType[
        platform.guildPlatform?.platformId
      ]?.toLowerCase()}.png`}
      layoutId={`${role.id}_role_${platform.guildPlatformId}_reward_img`}
      imgAlt={platform.guildPlatform?.platformGuildName}
      label={
        <>
          {getRewardLabel(platform)}
          {withLink ? (
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

const MotionImg = motion(Img)

const RewardDisplay = ({
  imgSrc,
  imgAlt,
  icon,
  label,
  rightElement,
  layoutId,
}: {
  imgSrc?: string
  imgAlt?: string
  icon?: ReactNode
  label: ReactNode
  rightElement?: ReactNode
  layoutId?: string
}) => (
  <HStack pt="3" spacing={0} alignItems={"flex-start"}>
    {icon ?? (
      <MotionImg
        layoutId={layoutId}
        transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
        src={imgSrc}
        alt={imgAlt}
        boxSize={6}
      />
    )}
    <Text px="2" maxW="calc(100% - var(--chakra-sizes-12))">
      {label}
    </Text>
    {rightElement}
  </HStack>
)

const RewardWrapper = ({ role, platform, withLink }: Props) => {
  const { guildPlatforms } = useGuild()

  const guildPlatform = guildPlatforms?.find(
    (p) => p.id === platform.guildPlatformId
  )

  if (!guildPlatform) return null

  const platformWithGuildPlatform = { ...platform, guildPlatform }

  return (
    <Reward platform={platformWithGuildPlatform} role={role} withLink={withLink} />
  )
}

export { RewardDisplay }
export default RewardWrapper
