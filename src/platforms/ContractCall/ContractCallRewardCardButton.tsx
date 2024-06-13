import { Tooltip } from "@chakra-ui/react"
import useGuildRewardNftBalanceByUserId from "components/[guild]/collect/hooks/useGuildRewardNftBalanceByUserId"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import Link from "next/link"
import { GuildPlatform } from "types"
import { Chains } from "wagmiConfig/chains"

type Props = {
  platform: GuildPlatform
}

const ContractCallRewardCardButton = ({ platform }: Props) => {
  const { urlName, roles } = useGuild()
  const { captureEvent } = usePostHogContext()
  const postHogOptions = { guild: urlName }

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const { chain, contractAddress } = platform.platformGuildData

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const role = roles.find((r) =>
    r.rolePlatforms?.find((rp) => rp.guildPlatformId === platform.id)
  )

  const { data: nftBalance } = useGuildRewardNftBalanceByUserId({
    nftAddress: contractAddress,
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    chainId: Chains[chain],
  })
  // @ts-expect-error TODO: fix this error originating from strictNullChecks
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
      prefetch={false}
    >
      {alreadyCollected ? "View NFT details" : "Collect NFT"}
    </Button>
  )
}

export default ContractCallRewardCardButton
