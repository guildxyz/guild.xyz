import ColorCard from "components/common/ColorCard"
import Link from "components/common/Link"
import isNumber from "components/common/utils/isNumber"
import RequirementChainTypeText from "components/create-guild/Requirements/components/RequirementChainTypeText"
import { RPC } from "connectors"
import { Requirement, RequirementTypeColors } from "temporaryData/types"
import { Rest } from "types"
import MirrorEdition from "./components/MirrorEdition"
import RequirementText from "./components/RequirementText"
import SnapshotStrategy from "./components/SnapshotStrategy"
import Token from "./components/Token"
import Whitelist from "./components/Whitelist"

type Props = {
  requirement: Requirement
} & Rest

const RequirementCard = ({ requirement, ...rest }: Props): JSX.Element => {
  // TODO: The application will handle this type of values in a different way in the future, we'll need to change this later!
  let minmax
  try {
    minmax = JSON.parse(requirement?.value?.toString())
  } catch (_) {
    minmax = null
  }

  return (
    <ColorCard
      color={RequirementTypeColors[requirement?.type]}
      pr={
        !["SNAPSHOT", "WHITELIST"].includes(requirement.type) &&
        "var(--chakra-space-32) !important"
      }
      {...rest}
    >
      {(() => {
        switch (requirement.type) {
          case "ERC721":
            return requirement.key ? (
              <RequirementText>{`Own a(n) ${
                requirement.symbol === "-" &&
                requirement.address?.toLowerCase() ===
                  "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"
                  ? "ENS"
                  : requirement.name
              } ${
                requirement.value && requirement.key
                  ? `with ${
                      Array.isArray(minmax) &&
                      minmax.length === 2 &&
                      minmax.every(isNumber)
                        ? `${minmax[0]}-${minmax[1]}`
                        : requirement.value
                    } ${requirement.key}`
                  : ""
              }`}</RequirementText>
            ) : (
              <RequirementText>
                {`Own a(n) `}
                <Link
                  href={`${RPC[requirement.chain]?.blockExplorerUrls?.[0]}/token/${
                    requirement.address
                  }`}
                  isExternal
                  title="View on Etherscan"
                >
                  {requirement.symbol === "-" &&
                  requirement.address?.toLowerCase() ===
                    "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"
                    ? "ENS"
                    : requirement.name}
                </Link>
                {` NFT`}
              </RequirementText>
            )
          case "POAP":
            return (
              <RequirementText>{`Own the ${requirement.value} POAP`}</RequirementText>
            )
          case "MIRROR":
            return <MirrorEdition id={requirement.value} />
          case "ERC20":
          case "COIN":
            return <Token requirement={requirement} />
          case "SNAPSHOT":
            return <SnapshotStrategy requirement={requirement} />
          case "WHITELIST":
            return (
              <Whitelist
                whitelist={Array.isArray(requirement.value) ? requirement.value : []}
              />
            )
        }
      })()}

      <RequirementChainTypeText
        requirementChain={requirement?.chain}
        requirementType={requirement?.type}
        bottom={"-px"}
        right={"-px"}
        borderTopLeftRadius="xl"
        borderBottomRightRadius="xl"
      />
    </ColorCard>
  )
}

export default RequirementCard
