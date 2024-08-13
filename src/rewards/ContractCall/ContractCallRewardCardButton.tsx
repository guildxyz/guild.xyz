import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { Tooltip } from "@chakra-ui/react"
import useGuildRewardNftBalanceByUserId from "components/[guild]/collect/hooks/useGuildRewardNftBalanceByUserId"
import useGuild from "components/[guild]/hooks/useGuild"
import Link from "next/link"
import { RewardCardButton } from "rewards/components/RewardCardButton"
import { GuildPlatform } from "types"
import { Chains } from "wagmiConfig/chains"

type Props = {
  platform: GuildPlatform
}

const ContractCallRewardCardButton = ({ platform }: Props) => {
  const { urlName, roles } = useGuild()
  const { captureEvent } = usePostHogContext()
  const postHogOptions = { guild: urlName }

  const { chain, contractAddress } = platform.platformGuildData

  const role = roles.find((r) =>
    r.rolePlatforms?.find((rp) => rp.guildPlatformId === platform.id)
  )

  const { data: nftBalance } = useGuildRewardNftBalanceByUserId({
    nftAddress: contractAddress,
    chainId: Chains[chain],
  })
  const alreadyCollected = nftBalance > 0

  if (!role)
    return (
      <Tooltip label="You need to add this reward to a role first">
        <RewardCardButton isDisabled colorScheme="cyan">
          Collect NFT
        </RewardCardButton>
      </Tooltip>
    )

  return (
    <RewardCardButton
      as={Link}
      colorScheme="cyan"
      href={`/${urlName}/collect/${chain.toLowerCase()}/${contractAddress.toLowerCase()}`}
      onClick={() => {
        captureEvent(
          "Click on collect page link (ContractCallRewardCardButton)",
          postHogOptions
        )
      }}
      prefetch={false}
    >
      {alreadyCollected ? "View NFT details" : "Collect NFT"}
    </RewardCardButton>
  )
}

export default ContractCallRewardCardButton
