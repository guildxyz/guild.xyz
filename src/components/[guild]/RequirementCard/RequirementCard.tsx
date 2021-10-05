import { Text } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import Link from "components/common/Link"
import { Requirement, RequirementTypeColors } from "temporaryData/types"
import SnapshotStrategy from "./components/SnapshotStrategy"
import Token from "./components/Token"

type Props = {
  requirement: Requirement
}
const RequirementCard = ({ requirement }: Props): JSX.Element => {
  // const { nfts } = useNfts()

  return (
    <ColorCard color={RequirementTypeColors[requirement.type]}>
      <Text fontWeight="bold" letterSpacing="wide">
        {(() => {
          // if (nfts?.map((nft) => nft.type).includes(requirement.type)) {
          //   return `Own a(n) ${
          //     nfts?.find((nft) => nft.type === requirement.type).name
          //   } ${
          //     requirement.value && requirement.data
          //       ? `with ${requirement.value} ${requirement.data}`
          //       : ""
          //   }`
          // }

          switch (requirement.type) {
            case "OPENSEA":
              return `Own a(n) ${requirement.name} ${
                requirement.value && requirement.data
                  ? `with ${requirement.value} ${requirement.data}`
                  : ""
              }`
            case "NFT":
              return (
                <Text as="span">
                  {`Own a(n) `}
                  <Link
                    href={`https://etherscan.io/token/${requirement.address}`}
                    isExternal
                    title="View on Etherscan"
                  >
                    {requirement.symbol}
                  </Link>
                  {` NFT`}
                </Text>
              )
            case "POAP":
              return `Own the ${requirement.value} POAP`

            case "TOKEN":
            case "ETHER":
              return <Token requirement={requirement} />

            case "SNAPSHOT":
              return <SnapshotStrategy requirement={requirement} />
          }
        })()}
      </Text>
    </ColorCard>
  )
}

export default RequirementCard
