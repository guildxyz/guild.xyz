import { Wrap, WrapProps } from "@chakra-ui/react"
import {
  CapacityTag,
  EndTimeTag,
  StartTimeTag,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import { PropsWithChildren } from "react"
import guildRewardNftAbi from "static/abis/guildRewardNft"
import { GuildPlatform, RolePlatform } from "types"
import { useReadContracts } from "wagmi"
import { Chains } from "wagmiConfig/chains"

type Props = { guildPlatform: GuildPlatform; rolePlatform: RolePlatform } & WrapProps

const NftAvailabilityTags = ({
  guildPlatform,
  rolePlatform,
  children,
  ...wrapProps
}: PropsWithChildren<Props>) => {
  const contract = {
    abi: guildRewardNftAbi,
    address: guildPlatform.platformGuildData.contractAddress,
    chainId: Chains[guildPlatform.platformGuildData.chain],
  } as const

  const { data } = useReadContracts({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    contracts: [
      {
        ...contract,
        functionName: "maxSupply",
      },
      {
        ...contract,
        functionName: "totalSupply",
      },
    ],
  })

  const [maxSupplyResponse, totalSupplyResponse] = data ?? []

  const maxSupply = maxSupplyResponse?.result
  const totalSupply = totalSupplyResponse?.result

  return (
    <Wrap spacing={1} {...wrapProps}>
      {typeof maxSupply === "bigint" && typeof totalSupply === "bigint" && (
        <CapacityTag
          capacity={Number(maxSupply)}
          claimedCount={Number(totalSupply)}
        />
      )}

      {rolePlatform?.startTime && (
        <StartTimeTag startTime={rolePlatform.startTime} />
      )}

      {rolePlatform?.endTime && <EndTimeTag endTime={rolePlatform.endTime} />}

      {children}
    </Wrap>
  )
}

export default NftAvailabilityTags
