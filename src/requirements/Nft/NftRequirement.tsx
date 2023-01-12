import { Skeleton, Text } from "@chakra-ui/react"
import { ImageData } from "@nouns/assets"
import DataBlock from "components/common/DataBlock"
import useOpenseaAssetData from "hooks/useOpenseaAssetData"
import { Fragment } from "react"
import { Requirement as RequirementType, Trait } from "types"
import shortenHex from "utils/shortenHex"
import OpenseaUrl from "../common/OpenseaUrl"
import Requirement from "../common/Requirement"
import useNftMetadata, { NOUNS_BACKGROUNDS } from "./hooks/useNftMetadata"

type Props = {
  requirement: RequirementType
}

const imageDataTypeMap = {
  body: "bodies",
  accessory: "accessories",
  head: "heads",
  glasses: "glasses",
}

const getNounsRequirementType = (trait: Trait) =>
  !trait
    ? undefined
    : trait.trait_type === "background"
    ? NOUNS_BACKGROUNDS?.[trait.value]
    : ImageData.images?.[imageDataTypeMap[trait.trait_type]]?.[+trait.value]
        ?.filename

const NftRequirement = ({ requirement: receivedRequirement, ...rest }: Props) => {
  // Converting the requirement to the new format if needed
  const requirement = Object.entries(receivedRequirement.data?.attribute ?? {})
    .length
    ? {
        ...receivedRequirement,
        data: {
          ...receivedRequirement.data,
          attributes: [
            {
              trait_type: receivedRequirement.data?.attribute?.trait_type,
              interval: receivedRequirement.data.attribute.interval,
              value: receivedRequirement.data.attribute.value,
            },
          ],
          attribute: undefined,
        },
      }
    : receivedRequirement

  const { metadata, isLoading } = useNftMetadata(
    requirement.chain === "ETHEREUM" ? requirement.address : null
  )
  const { data, isValidating } = useOpenseaAssetData(requirement)

  const nftDataLoading = isLoading || isValidating
  const nftName = metadata?.name || data?.name
  const nftImage = metadata?.image || data?.image

  const shouldRenderImage =
    ["ETHEREUM", "POLYGON"].includes(requirement.chain) &&
    (nftName || (requirement.name && requirement.name !== "-")) &&
    (nftDataLoading || nftImage)

  return (
    <Requirement
      image={
        shouldRenderImage ? (
          nftDataLoading ? (
            ""
          ) : (
            nftImage
          )
        ) : (
          <Text as="span" fontWeight="bold" fontSize="xs">
            NFT
          </Text>
        )
      }
      isImageLoading={nftDataLoading}
      footer={<OpenseaUrl requirement={requirement} />}
      {...rest}
    >
      {"Own "}
      {requirement.data?.id ? (
        nftName || nftDataLoading ? (
          <>
            <Skeleton as="span" isLoaded={!nftDataLoading} display="inline">{`the ${
              nftName || "loading..."
            }`}</Skeleton>{" "}
          </>
        ) : (
          `the #${requirement.data.id} `
        )
      ) : requirement.data?.maxAmount > 0 ? (
        `${requirement.data?.minAmount}-${requirement.data?.maxAmount}`
      ) : requirement.data?.minAmount > 1 ? (
        `at least ${requirement.data?.minAmount} `
      ) : (
        <>
          {"a(n) "}
          {nftName ||
            (!requirement.name || requirement.name === "-"
              ? data?.slug ?? (
                  <DataBlock>{shortenHex(requirement.address, 3)}</DataBlock>
                )
              : requirement.name !== "-" && requirement.name)}
        </>
      )}

      {requirement.data?.attributes?.length ? (
        <>
          {" with "}
          {requirement.data.attributes.map((trait, index) => {
            const attributeValue =
              requirement.type === "NOUNS"
                ? getNounsRequirementType(trait)
                : trait.value
            return (
              <Fragment key={`${trait.trait_type}-${trait.value}`}>
                {attributeValue || trait.interval
                  ? `${
                      trait.interval
                        ? `${trait.interval.min}-${trait.interval.max}`
                        : attributeValue
                    } ${trait.trait_type}${
                      index < requirement.data.attributes.length - 1 ? ", " : ""
                    }`
                  : ""}
              </Fragment>
            )
          })}
        </>
      ) : (
        ` NFT${
          requirement.data?.maxAmount > 0 || requirement.data?.minAmount > 1
            ? "s"
            : ""
        }`
      )}
    </Requirement>
  )
}

export default NftRequirement
