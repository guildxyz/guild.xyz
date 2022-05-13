import { HStack, Img, Link } from "@chakra-ui/react"
import { RPC } from "connectors"
import { Requirement } from "types"
import RequirementCard from "../common/RequirementCard"
import RequirementText from "../common/RequirementText"
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
            alt={requirement.data?.minAmount?.toString()}
            width={6}
            borderRadius="full"
          />
        )}
        <RequirementText>
          {`Hold ${
            requirement.data?.maxAmount
              ? `${requirement.data.minAmount} - ${requirement.data.maxAmount}`
              : requirement.data?.minAmount > 0
              ? `at least ${requirement.data?.minAmount}`
              : "any amount of"
          } `}
          {requirement.type === "COIN" ? (
            requirement.symbol
          ) : (
            <Link
              href={`${RPC[requirement.chain]?.blockExplorerUrls?.[0]}/${
                requirement.chain === "BOBA" ? "tokens" : "token"
              }/${requirement.address}`}
              isExternal
              title="View on explorer"
            >
              {requirement.symbol}
            </Link>
          )}
        </RequirementText>
      </HStack>
    </RequirementCard>
  )
}

export default TokenRequirementCard
