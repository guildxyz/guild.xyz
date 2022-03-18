import { Text, useColorMode } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import Link from "components/common/Link"
import RequirementChainTypeText from "components/create-guild/Requirements/components/RequirementChainTypeText"
import { RPC } from "connectors"
import { Requirement, RequirementTypeColors, Rest } from "types"
import shortenHex from "utils/shortenHex"
import useGuild from "../hooks/useGuild"
import Allowlist from "./components/Allowlist"
import Mirror from "./components/Mirror"
import RequirementText from "./components/RequirementText"
import SnapshotStrategy from "./components/SnapshotStrategy"
import Token from "./components/Token"

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
  const { roles } = useGuild()

  return (
    <ColorCard
      color={RequirementTypeColors[requirement?.type]}
      pr={
        !["SNAPSHOT", "ALLOWLIST"].includes(requirement.type) &&
        "var(--chakra-space-32) !important"
      }
      {...rest}
    >
      {(() => {
        switch (requirement.type) {
          case "FREE":
            return (
              <RequirementText>{`Anyone can join this ${
                roles?.length > 1 ? "role" : "guild"
              }`}</RequirementText>
            )
          case "ERC721":
          case "ERC1155":
          case "UNLOCK":
            return requirement.data?.attribute?.trait_type ? (
              <RequirementText>
                {`Own ${
                  requirement.data?.amount > 1
                    ? `at least ${requirement.data?.amount}`
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
                  requirement.data?.attribute?.value ||
                  requirement.data?.attribute?.interval
                    ? ` with ${
                        requirement.data?.attribute?.interval
                          ? `${requirement.data?.attribute?.interval?.min}-${requirement.data?.attribute?.interval?.max}`
                          : requirement.data?.attribute?.value
                      } ${requirement.data?.attribute?.trait_type}`
                    : ""
                }`}
              </RequirementText>
            ) : (
              <RequirementText>
                {`Own ${
                  requirement.data?.id
                    ? `the #${requirement.data.id}`
                    : requirement.data?.amount > 1
                    ? `at least ${requirement.data?.amount}`
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
          case "JUICEBOX":
            return (
              <RequirementText>{`Hold ${
                requirement.data?.amount > 0
                  ? `at least ${requirement.data?.amount}`
                  : "any amount of"
              } ${requirement.symbol} ticket(s) in Juicebox`}</RequirementText>
            )
          case "POAP":
            return (
              <RequirementText>{`Own the ${requirement.data?.id} POAP`}</RequirementText>
            )
          case "MIRROR":
            return <Mirror requirement={requirement} />
          case "ERC20":
          case "COIN":
            return <Token requirement={requirement} />
          case "SNAPSHOT":
            return <SnapshotStrategy requirement={requirement} />
          case "ALLOWLIST":
            return (
              <Allowlist
                allowlist={requirement.data?.addresses}
                hidden={requirement.data?.hideAllowlist}
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
