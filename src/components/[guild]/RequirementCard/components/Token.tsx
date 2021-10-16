import { Img } from "@chakra-ui/image"
import { HStack, Link, Text } from "@chakra-ui/layout"
import { Requirement } from "temporaryData/types"
import useTokenImage from "../hooks/useTokenImage"

type Props = {
  requirement: Requirement
}

const Token = ({ requirement }: Props) => {
  const tokenImage = useTokenImage(requirement.address)

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
        {requirement.type === "ETHER" ? (
          requirement.symbol
        ) : (
          <Link
            href={`https://etherscan.io/token/${requirement.address}`}
            isExternal
            title="View on Etherscan"
          >
            {requirement.symbol}
          </Link>
        )}
      </Text>
    </HStack>
  )
}

export default Token
