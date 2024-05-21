import { Circle, Img, SkeletonCircle, SkeletonProps } from "@chakra-ui/react"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { motion } from "framer-motion"
import { ArrowRight } from "phosphor-react"
import {
  RewardDisplay,
  RewardIconProps,
  RewardProps,
} from "../../components/[guild]/RoleCard/components/Reward"

import { usePostHogContext } from "components/_app/PostHogProvider"
import Link from "next/link"
import { forwardRef } from "react"
import NftAvailabilityTags from "./components/NftAvailabilityTags"

const ContractCallReward = ({
  platform,
  withMotionImg,
  isLinkColorful,
}: RewardProps) => {
  const { urlName } = useGuild()

  const { captureEvent } = usePostHogContext()
  const postHogOptions = { guild: urlName }

  const { chain, contractAddress } = platform.guildPlatform.platformGuildData ?? {}
  const { name, isLoading } = useNftDetails(chain, contractAddress)

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
          <Button
            as={Link}
            variant="link"
            rightIcon={<ArrowRight />}
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
          </Button>
        </>
      }
    >
      <NftAvailabilityTags
        guildPlatform={platform.guildPlatform}
        rolePlatform={platform}
        mt={1}
      />
    </RewardDisplay>
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
    guildPlatform?.platformGuildData?.contractAddress
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
