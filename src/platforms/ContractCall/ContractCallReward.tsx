import { Circle, Img, SkeletonCircle, SkeletonProps } from "@chakra-ui/react"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import LinkButton from "components/common/LinkButton"
import { motion } from "framer-motion"
import { ArrowSquareOut } from "phosphor-react"
import {
  RewardDisplay,
  RewardIconProps,
  RewardProps,
} from "../../components/[guild]/RoleCard/components/Reward"

import { usePostHogContext } from "components/_app/PostHogProvider"
import { forwardRef } from "react"

const ContractCallReward = ({
  platform,
  withMotionImg,
  isLinkColorful,
}: RewardProps) => {
  const { urlName } = useGuild()

  const { captureEvent } = usePostHogContext()
  const postHogOptions = { guild: urlName }

  const { chain, contractAddress } = platform.guildPlatform.platformGuildData ?? {}
  const { name, isLoading } = useNftDetails(chain, contractAddress as `0x${string}`)

  return (
    <RewardDisplay
      icon={
        <ContractCallRewardIcon
          rolePlatformId={platform.id}
          guildPlatform={platform?.guildPlatform}
          withMotionImg={withMotionImg}
          isLoading={isLoading}
        />
      }
      label={
        <>
          {`Collect: `}
          <LinkButton
            variant="link"
            rightIcon={<ArrowSquareOut />}
            iconSpacing="1"
            maxW="full"
            href={`/${urlName}/collect/${chain.toLowerCase()}/${contractAddress.toLowerCase()}`}
            onClick={() => {
              captureEvent(
                "Click on collect page link (ContractCallReward)",
                postHogOptions
              )
            }}
            colorScheme={isLinkColorful ? "blue" : "gray"}
          >
            {name ?? "NFT"}
          </LinkButton>
        </>
      }
    />
  )
}

const MotionImg = motion(Img)

const MotionSkeletonCircle = motion(
  forwardRef((props: SkeletonProps, ref: any) => (
    <Circle ref={ref} size={props.boxSize}>
      <SkeletonCircle {...props} />
    </Circle>
  ))
)

const ContractCallRewardIcon = ({
  rolePlatformId,
  guildPlatform,
  isLoading,
  withMotionImg = true,
  transition,
}: RewardIconProps & { isLoading?: boolean }) => {
  const { image } = useNftDetails(
    guildPlatform?.platformGuildData?.chain,
    guildPlatform?.platformGuildData?.contractAddress as `0x${string}`
  )

  const props = {
    src: image,
    alt: guildPlatform?.platformGuildName,
    boxSize: 6,
    borderRadius: "full",
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

export default ContractCallReward
