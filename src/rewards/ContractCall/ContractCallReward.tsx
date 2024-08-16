import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { Img } from "@chakra-ui/react"
import { ArrowRight } from "@phosphor-icons/react"
import { RewardDisplay } from "components/[guild]/RoleCard/components/RewardDisplay"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import Link from "next/link"
import {
  RewardIconProps,
  RewardProps,
} from "../../components/[guild]/RoleCard/components/types"
import NftAvailabilityTags from "./components/NftAvailabilityTags"

const ContractCallReward = ({ platform, isLinkColorful }: RewardProps) => {
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

const ContractCallRewardIcon = ({
  guildPlatform,
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

  return <Img {...props} />
}

export default ContractCallReward
