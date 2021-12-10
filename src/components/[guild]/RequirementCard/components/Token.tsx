import { HStack, Img, Link, Text } from "@chakra-ui/react"
import { RPC } from "connectors"
import { Requirement } from "types"
import useTokenImage from "../hooks/useTokenImage"

type Props = {
  requirement: Requirement
}

const Token = ({ requirement }: Props) => {
  const tokenImage = useTokenImage(requirement.chain, requirement.address)

  return (
    <HStack spacing={4} alignItems="center">
      {tokenImage && (
        <Img
          src={tokenImage}
          alt={requirement.value?.toString()}
          width={6}
          borderRadius="full"
        />
      )}
      <Text fontWeight="bold" letterSpacing="wide">
        {`Hold ${
          +requirement.value > 0 ? `at least ${requirement.value}` : "any amount of"
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
  )
}

export default Token
