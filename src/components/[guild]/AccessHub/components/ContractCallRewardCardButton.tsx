import LinkButton from "components/common/LinkButton"
import useGuild from "components/[guild]/hooks/useGuild"
import { GuildPlatform } from "types"

type Props = {
  reward: GuildPlatform
}

const ContractCallRewardCardButton = ({ reward }: Props) => {
  const { urlName } = useGuild()
  const { chain, contractAddress } = reward.platformGuildData

  return (
    <LinkButton
      colorScheme="cyan"
      href={`/${urlName}/collect/${chain.toLowerCase()}/${contractAddress.toLowerCase()}`}
    >
      Collect NFT
    </LinkButton>
  )
}

export default ContractCallRewardCardButton
