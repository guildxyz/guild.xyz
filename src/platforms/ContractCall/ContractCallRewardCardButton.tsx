import { Tooltip } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import LinkButton from "components/common/LinkButton"
import { Chains } from "connectors"
import { GuildPlatform } from "types"
import { useAccount, useBalance } from "wagmi"

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
  const { data: nftBalanceData } = useBalance({
    address,
    token: contractAddress,
    chainId: Chains[chain],
  })
  const alreadyCollected = nftBalanceData?.value > 0

  if (!role)
    return (
      <Tooltip label="You need to add this reward to a role first">
        <Button isDisabled colorScheme="cyan">
          Collect NFT
        </Button>
      </Tooltip>
    )

  return (
    <LinkButton
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
    </LinkButton>
  )
}

export default ContractCallRewardCardButton
