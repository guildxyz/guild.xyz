import { Tooltip } from "@chakra-ui/react"
import { BigNumber } from "@ethersproject/bignumber"
import Button from "components/common/Button"
import LinkButton from "components/common/LinkButton"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { Chains } from "connectors"
import useBalance from "hooks/useBalance"
import { GuildPlatform } from "types"

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

  const { tokenBalance: nftBalance } = useBalance(contractAddress, Chains[chain])
  const alreadyCollected = nftBalance?.gt(BigNumber.from(0))

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
