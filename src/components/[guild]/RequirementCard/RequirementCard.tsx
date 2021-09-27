import { Link, Text } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import useNftsList from "components/create-guild/NftFormCard/hooks/useNftsList"
import { Requirement, RequirementTypeColors } from "temporaryData/types"

type Props = {
  requirement: Requirement
}
const RequirementCard = ({ requirement }: Props): JSX.Element => {
  const nfts = useNftsList()

  return (
    <ColorCard color={RequirementTypeColors[requirement.type]}>
      <Text fontWeight="bold" letterSpacing="wide">
        {(() => {
          if (nfts?.map((nft) => nft.info.type).includes(requirement.type)) {
            return `Own a(n) ${
              nfts?.find((nft) => nft.info.type === requirement.type).info.name
            } ${
              requirement.value && requirement.data
                ? `with ${requirement.value} ${requirement.data}`
                : ""
            }`
          }

          if (requirement.type === "POAP") return `Own the ${requirement.value} POAP`

          if (requirement.type === "TOKEN") {
            return (
              <>
                {`Hold at least ${requirement.value} `}
                <Link
                  href={`https://etherscan.io/token/${requirement.address}`}
                  isExternal
                  title="View on etherscan"
                >
                  {requirement.symbol}
                </Link>
              </>
            )
          }
        })()}
      </Text>
    </ColorCard>
  )
}

export default RequirementCard
