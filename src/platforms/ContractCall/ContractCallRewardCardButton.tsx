import { Tooltip } from "@chakra-ui/react"
import { Chains } from "chains"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import useNftBalance from "hooks/useNftBalance"
import Link from "next/link"
import { GuildPlatform } from "types"
import { useAccount } from "wagmi"

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

  const { address } = useAccount()
  const { data: nftBalance } = useNftBalance({
    address,
    nftAddress: contractAddress,
    chainId: Chains[chain],
  })
  const alreadyCollected = nftBalance > 0

  if (!role)
    return (
      <Tooltip label="You need to add this reward to a role first">
        <Button isDisabled colorScheme="cyan">
          Collect NFT
        </Button>
      </Tooltip>
    )

  return (
    <Button
      as={Link}
      colorScheme="cyan"
      href={`/${urlName}/collect/${chain.toLowerCase()}/${contractAddress.toLowerCase()}`}
      onClick={() => {
        captureEvent(
          "Click on collect page link (ContractCallRewardCardButton)",
          postHogOptions
        )
      }}
    >
      {alreadyCollected ? "View NFT details" : "Collect NFT"}
    </Button>
  )
}

export default ContractCallRewardCardButton
