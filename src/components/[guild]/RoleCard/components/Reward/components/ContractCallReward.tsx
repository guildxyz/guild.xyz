import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import LinkButton from "components/common/LinkButton"
import { ArrowSquareOut } from "phosphor-react"
import { RolePlatform } from "types"
import { RewardDisplay, RewardIcon } from "../Reward"

type Props = {
  platform: RolePlatform
  withMotionImg: boolean
}

const ContractCallReward = ({ platform, withMotionImg }: Props) => {
  const { urlName } = useGuild()
  const { chain, contractAddress } = platform.guildPlatform.platformGuildData ?? {}
  const { data: nftData } = useNftDetails(chain, contractAddress)

  return (
    <RewardDisplay
      icon={
        <RewardIcon
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
            colorScheme="gray"
          >
            {nftData?.name ?? "NFT"}
          </LinkButton>
        </>
      }
    />
  )
}
export default ContractCallReward
