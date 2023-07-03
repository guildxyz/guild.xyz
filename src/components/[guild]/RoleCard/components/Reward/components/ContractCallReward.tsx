import { Circle, Img, SkeletonCircle, SkeletonProps } from "@chakra-ui/react"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import LinkButton from "components/common/LinkButton"
import { motion } from "framer-motion"
import { ArrowSquareOut } from "phosphor-react"
import { RewardDisplay, RewardIconProps, RewardProps } from "../Reward"

import { forwardRef } from "react"

const ContractCallReward = ({
  platform,
  withMotionImg,
  isLinkColorful,
}: RewardProps) => {
  const { urlName } = useGuild()
  const { chain, contractAddress } = platform.guildPlatform.platformGuildData ?? {}
  const { data: nftData } = useNftDetails(chain, contractAddress)

  return (
    <RewardDisplay
      icon={
        <ContractCallRewardIcon
          rolePlatformId={platform.id}
          guildPlatform={platform?.guildPlatform}
          withMotionImg={withMotionImg}
          isLoading={!nftData}
        />
      }
      label={
        <>
          {`Collect: `}
          <LinkButton
            variant={"link"}
            rightIcon={<ArrowSquareOut />}
            iconSpacing="1"
            maxW="full"
            href={`/${urlName}/collect/${chain.toLowerCase()}/${contractAddress.toLowerCase()}`}
            colorScheme={isLinkColorful ? "blue" : "gray"}
          >
            {nftData?.name ?? "NFT"}
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

export const ContractCallRewardIcon = ({
  rolePlatformId,
  guildPlatform,
  isLoading,
  withMotionImg = true,
  transition,
}: RewardIconProps & { isLoading?: boolean }) => {
  const { data: nftData } = useNftDetails(
    guildPlatform?.platformGuildData?.chain,
    guildPlatform?.platformGuildData?.contractAddress
  )

  const props = {
    src: nftData?.image,
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

export default ContractCallReward
