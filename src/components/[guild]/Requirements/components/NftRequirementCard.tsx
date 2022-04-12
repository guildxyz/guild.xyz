import { Link, Text, useColorMode } from "@chakra-ui/react"
import { RPC } from "connectors"
import { Requirement } from "types"
import shortenHex from "utils/shortenHex"
import RequirementCard from "./common/RequirementCard"
import RequirementText from "./common/RequirementText"

type Props = {
  requirement: Requirement
}

const FormattedRequirementName = ({ requirement }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  return requirement.name === "-" ? (
    <Text
      mr={1}
      px={1}
      py={0.5}
      borderRadius="md"
      fontSize="sm"
      bgColor={colorMode === "light" ? "blackAlpha.100" : "blackAlpha.300"}
      fontWeight="normal"
    >
      {shortenHex(requirement.address, 3)}
    </Text>
  ) : (
    <>{requirement.name}</>
  )
}

const NftRequirementCard = ({ requirement }: Props) => (
  <RequirementCard requirement={requirement}>
    {requirement.data?.attribute?.trait_type ? (
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
            <FormattedRequirementName requirement={requirement} />
          )}
        </Link>
        {` ${
          requirement.data?.attribute?.value || requirement.data?.attribute?.interval
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
              <FormattedRequirementName requirement={requirement} />
              {` NFT`}
            </>
          )}
        </Link>
      </RequirementText>
    )}
  </RequirementCard>
)

export default NftRequirementCard
