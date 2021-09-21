import { Link, Text } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import useNftsList from "components/create-guild/NftFormCard/hooks/useNfts"
import useTokenData from "hooks/useTokenData"
import { Requirement, RequirementTypeColors } from "temporaryData/types"

type Props = {
  requirement: Requirement
}

const RequirementCard = ({ requirement }: Props): JSX.Element => {
  const {
    data: [tokenName, tokenSymbol],
  } = useTokenData(requirement.address)

  const nfts = useNftsList()

  return (
    <ColorCard color={RequirementTypeColors[requirement.type]}>
      <Text fontWeight="bold" letterSpacing="wide">
        {(() => {
          switch (requirement.type) {
            case "NFT":
            case "CRYPTOPUNKS":
            case "BAYC":
            case "LOOT":
            case "COOLCATS":
              return `Own a(n) ${
                nfts?.find((_) => _.type === requirement.type).name
              } ${
                requirement.value && requirement.data
                  ? `with ${requirement.value} ${requirement.data}`
                  : ""
              }`
            case "POAP":
              return `Own the ${requirement.value} POAP`
            case "TOKEN":
              return (
                <>
                  {`Hold at least ${requirement.value} `}
                  <Link
                    href={`https://etherscan.io/token/${requirement.address}`}
                    isExternal
                    title="View on etherscan"
                  >
                    {tokenSymbol}
                  </Link>
                </>
              )
            default:
          }
        })()}
      </Text>
    </ColorCard>
  )
}

export default RequirementCard
