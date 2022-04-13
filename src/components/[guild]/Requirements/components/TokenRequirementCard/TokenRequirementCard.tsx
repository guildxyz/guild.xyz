import { HStack, Img, Link, Text } from "@chakra-ui/react"
import { RPC } from "connectors"
import { Requirement } from "types"
import RequirementCard from "../common/RequirementCard"
import useTokenImage from "./hooks/useTokenImage"

type Props = {
  requirement: Requirement
}

const TokenRequirementCard = ({ requirement }: Props) => {
  const tokenImage = useTokenImage(requirement.chain, requirement.address)

  return (
    <RequirementCard requirement={requirement}>
      <HStack spacing={4} alignItems="center">
        {tokenImage && (
          <Img
            src={tokenImage}
            alt={requirement.data?.amount?.toString()}
            width={6}
            borderRadius="full"
          />
        )}
        <Text fontWeight="bold" letterSpacing="wide">
          {`Hold ${
            +requirement.data?.amount > 0
              ? `at least ${requirement.data?.amount}`
              : "any amount of"
          } `}
          {requirement.type === "COIN" ? (
            requirement.symbol
          ) : (
            <Link
              href={`${RPC[requirement.chain]?.blockExplorerUrls?.[0]}/token/${
                requirement.address
              }`}
              isExternal
              title="View on explorer"
            >
              {requirement.symbol}
            </Link>
          )}
        </Text>
      </HStack>
    </RequirementCard>
  )
}

export default TokenRequirementCard
