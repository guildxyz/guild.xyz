import {
  HStack,
  Img,
  Link,
  SkeletonCircle,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import { RPC } from "connectors"
import { useMemo } from "react"
import { Requirement } from "types"
import shortenHex from "utils/shortenHex"
import RequirementCard from "../common/RequirementCard"
import RequirementText from "../common/RequirementText"
import useNftImage from "./hooks/useNftImage"

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

const NftRequirementCard = ({ requirement }: Props) => {
  const { nftImage, isLoading } = useNftImage(
    requirement.chain === "ETHEREUM" ? requirement.address : null
  )

  const shouldRenderImage = useMemo(
    () =>
      requirement.chain === "ETHEREUM" &&
      requirement.name &&
      requirement.name !== "-",
    [requirement]
  )

  return (
    <RequirementCard requirement={requirement}>
      <HStack spacing={4} alignItems="center">
        {shouldRenderImage && (
          <SkeletonCircle minW={6} boxSize={6} isLoaded={!isLoading && !!nftImage}>
            <Img
              src={nftImage}
              alt={requirement.name}
              width={6}
              borderRadius="full"
            />
          </SkeletonCircle>
        )}

        {requirement.data?.attribute?.trait_type ? (
          <RequirementText>
            {`Own ${
              requirement.data?.minAmount > 1
                ? `at least ${requirement.data?.minAmount}`
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
                : requirement.data?.minAmount > 1
                ? `at least ${requirement.data?.minAmount}`
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
      </HStack>
    </RequirementCard>
  )
}

export default NftRequirementCard
