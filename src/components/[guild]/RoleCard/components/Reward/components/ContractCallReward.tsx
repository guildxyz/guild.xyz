import Link from "components/common/Link"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
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
          <Link
            href={`/${urlName}/collect/${chain.toLowerCase()}/${contractAddress.toLowerCase()}`}
            fontWeight="semibold"
          >
            {`Collect${nftData ? ` ${nftData.name} ` : " "}NFT`}
          </Link>
        </>
      }
    />
  )
}
export default ContractCallReward
