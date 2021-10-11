import { Text } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import Link from "components/common/Link"
import { Requirement, RequirementTypeColors } from "temporaryData/types"
import SnapshotStrategy from "./components/SnapshotStrategy"
import Token from "./components/Token"
import Whitelist from "./components/Whitelist"

type Props = {
  requirement: Requirement
}
const RequirementCard = ({ requirement }: Props): JSX.Element => {
  return (
    <ColorCard color={RequirementTypeColors[requirement.type]}>
      <Text fontWeight="bold" letterSpacing="wide">
        {(() => {
          switch (requirement.type) {
            case "OPENSEA":
            case "COOLCATS":
            case "LOOT":
            case "BAYC":
            case "MUTAGEN":
            case "CRYPTOPUNKS":
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
                    {requirement.symbol === "-" &&
                    requirement.address ===
                      "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"
                      ? "ENS"
                      : requirement.name}
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
            case "WHITELIST":
              return <Whitelist whitelist={requirement.data as Array<string>} />
          }
        })()}
      </Text>
    </ColorCard>
  )
}

export default RequirementCard
