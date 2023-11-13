import { Link, Text } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { nooxAbi } from "static/abis/noox"
import useSWRImmutable from "swr/immutable"
import { mainnet, useContractRead } from "wagmi"

type NooxBadgeMetadata = {
  name: string
  image_thumbnail: string
}

const NooxRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const {
    data: ipfsURL,
    isLoading: isContractCallLoading,
    isError,
  } = useContractRead({
    abi: nooxAbi,
    address: "0xf1c121a563a84d62a5f11152d064dd0d554024f9",
    chainId: mainnet.id,
    functionName: "uri",
    args: [BigInt(requirement.data.id)],
  })

  const { data: badgeData, isValidating } =
    useSWRImmutable<NooxBadgeMetadata>(ipfsURL)

  const isLoading = isContractCallLoading || isValidating

  return (
    <Requirement
      image={badgeData?.image_thumbnail?.replace("ipfs://", "https://ipfs.io/ipfs/")}
      isImageLoading={isLoading}
      {...props}
    >
      <Text as="span">{`Have the `}</Text>
      {!badgeData || isLoading || isError ? (
        <DataBlock
          isLoading={isLoading}
          error={isError && "Couldn't fetch Noox badge data"}
        >
          {`#${requirement.data.id}`}
        </DataBlock>
      ) : (
        <Link
          href={`https://noox.world/badge/${requirement.data.id}`}
          isExternal
          display="inline"
          colorScheme="blue"
          fontWeight="medium"
        >
          {badgeData.name}
        </Link>
      )}

      <Text as="span">{` Noox badge`}</Text>
    </Requirement>
  )
}

export default NooxRequirement
