import { Text, useColorMode } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import Link from "components/common/Link"
import RequirementChainTypeText from "components/create-guild/Requirements/components/RequirementChainTypeText"
import { RPC } from "connectors"
import { Requirement, RequirementTypeColors, Rest } from "types"
import isNumber from "utils/isNumber"
import shortenHex from "utils/shortenHex"
import useGuild from "../hooks/useGuild"
import Mirror from "./components/Mirror"
import RequirementText from "./components/RequirementText"
import SnapshotStrategy from "./components/SnapshotStrategy"
import Token from "./components/Token"
import Whitelist from "./components/Whitelist"

type Props = {
  requirement: Requirement
} & Rest

const FormattedRequirementName = ({
  name,
  address,
}: {
  name: string
  address: string
}): JSX.Element => {
  const { colorMode } = useColorMode()
  return name === "-" ? (
    <Text
      mr={1}
      px={1}
      py={0.5}
      borderRadius="md"
      fontSize="sm"
      bgColor={colorMode === "light" ? "blackAlpha.100" : "blackAlpha.300"}
      fontWeight="normal"
    >
      {shortenHex(address, 3)}
    </Text>
  ) : (
    <>{name}</>
  )
}

const RequirementCard = ({ requirement, ...rest }: Props): JSX.Element => {
  const { platforms } = useGuild()

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
          case "FREE":
            return (
              <RequirementText>{`Anyone can join this ${
                platforms?.[0]?.roles?.length > 1 ? "role" : "guild"
              }`}</RequirementText>
            )
          case "ERC721":
          case "ERC1155":
          case "UNLOCK":
            return requirement.key ? (
              <RequirementText>
                {`Own ${
                  typeof requirement.value === "string" &&
                  parseInt(requirement.value)?.toString() === requirement.value
                    ? `at least ${requirement.value}`
                    : "a(n)"
                } `}
                <Link
                  href={`${RPC[requirement.chain]?.blockExplorerUrls?.[0]}/token/${
                    requirement.address
                  }`}
                  isExternal
                  title="View on explorer"
                >
                  {requirement.symbol === "-" &&
                  requirement.address?.toLowerCase() ===
                    "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85" ? (
                    "ENS"
                  ) : (
                    <FormattedRequirementName
                      name={requirement.name}
                      address={requirement.address}
                    />
                  )}
                </Link>
                {` ${
                  requirement.value && requirement.key
                    ? ` with ${
                        Array.isArray(minmax) &&
                        minmax.length === 2 &&
                        minmax.every(isNumber)
                          ? `${minmax[0]}-${minmax[1]}`
                          : requirement.value
                      } ${requirement.key}`
                    : ""
                }`}
              </RequirementText>
            ) : (
              <RequirementText>
                {`Own ${
                  typeof requirement.value === "string" &&
                  parseInt(requirement.value) > 1
                    ? `at least ${requirement.value}`
                    : "a(n)"
                } `}
                <Link
                  href={`${RPC[requirement.chain]?.blockExplorerUrls?.[0]}/token/${
                    requirement.address
                  }`}
                  isExternal
                  title="View on explorer"
                >
                  {requirement.symbol === "-" &&
                  requirement.address?.toLowerCase() ===
                    "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85" ? (
                    "ENS"
                  ) : (
                    <>
                      <FormattedRequirementName
                        name={requirement.name}
                        address={requirement.address}
                      />
                      {` NFT`}
                    </>
                  )}
                </Link>
              </RequirementText>
            )
          case "CUSTOM_ID":
            return (
              <RequirementText>
                {`Hold the #${requirement.value} `}
                <Link
                  href={`${RPC[requirement.chain]?.blockExplorerUrls?.[0]}/token/${
                    requirement.address
                  }`}
                  isExternal
                  title="View on explorer"
                >
                  {requirement.symbol !== "-" ? `${requirement.symbol} NFT` : "NFT"}
                </Link>
              </RequirementText>
            )
          case "JUICEBOX":
            return (
              <RequirementText>{`Hold ${
                +requirement.value > 0
                  ? `at least ${requirement.value}`
                  : "any amount of"
              } ${requirement.symbol} ticket(s) in Juicebox`}</RequirementText>
            )
          case "POAP":
            return (
              <RequirementText>{`Own the ${requirement.value} POAP`}</RequirementText>
            )
          case "MIRROR":
            return <Mirror requirement={requirement} />
          case "ERC20":
          case "COIN":
            return <Token requirement={requirement} />
          case "SNAPSHOT":
            return <SnapshotStrategy requirement={requirement} />
          case "WHITELIST":
            return (
              <Whitelist
                whitelist={
                  Array.isArray(requirement.value)
                    ? (requirement.value as Array<string>)
                    : []
                }
              />
            )
        }
      })()}

      <RequirementChainTypeText
        requirementChain={requirement?.chain}
        requirementType={requirement?.type}
        bottom="-px"
        right="-px"
        borderTopLeftRadius="xl"
        borderBottomRightRadius="xl"
      />
    </ColorCard>
  )
}

export default RequirementCard
