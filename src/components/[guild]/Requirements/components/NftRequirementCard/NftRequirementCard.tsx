import { Text, useColorMode } from "@chakra-ui/react"
import { useMemo } from "react"
import { Requirement } from "types"
import shortenHex from "utils/shortenHex"
import OpenseaUrl from "../common/OpenseaUrl"
import RequirementCard from "../common/RequirementCard"
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
    <RequirementCard
      requirement={requirement}
      image={shouldRenderImage && (isLoading ? "" : nftImage)}
      loading={isLoading}
      footer={<OpenseaUrl requirement={requirement} />}
    >
      {requirement.data?.attribute?.trait_type ? (
        <>
          {`Own ${
            requirement.data?.minAmount > 1
              ? `at least ${requirement.data?.minAmount}`
              : "a(n)"
          } `}
          <>
            {requirement.symbol === "-" &&
            requirement.address?.toLowerCase() ===
              "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85" ? (
              "ENS"
            ) : (
              <FormattedRequirementName requirement={requirement} />
            )}
          </>
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
        </>
      ) : (
        <>
          {`Own ${
            requirement.data?.id
              ? `the #${requirement.data.id}`
              : requirement.data?.minAmount > 1
              ? `at least ${requirement.data?.minAmount}`
              : "a(n)"
          } `}
          <>
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
          </>
        </>
      )}
    </RequirementCard>
  )
}

export default NftRequirementCard
