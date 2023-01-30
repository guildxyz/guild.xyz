import { Text } from "@chakra-ui/react"
import { ImageData } from "@nouns/assets"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import OpenseaUrl from "components/[guild]/Requirements/components/OpenseaUrl"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { Fragment } from "react"
import { Trait } from "types"
import shortenHex from "utils/shortenHex"
import useNftMetadata, {
  NOUNS_BACKGROUNDS,
  useNftMetadataWithTraits,
} from "./hooks/useNftMetadata"

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

const NftRequirement = (props: RequirementProps) => {
  const receivedRequirement = useRequirementContext()

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

  const { metadata: metadataWithTraits, isLoading: isMetadataWithTraitsLoading } =
    useNftMetadata(requirement.chain, requirement.address, requirement.data.id)
  const { metadata, isLoading } = useNftMetadataWithTraits(
    requirement.chain,
    requirement.address
  )

  const nftDataLoading = isLoading || isMetadataWithTraitsLoading
  const nftName = metadataWithTraits?.name || metadata?.name
  const nftImage = metadataWithTraits?.image || metadata?.image

  const shouldRenderImage =
    ["ETHEREUM", "POLYGON"].includes(requirement.chain) &&
    (nftName || (requirement.name && requirement.name !== "-")) &&
    (nftDataLoading || nftImage)

  return (
    <Requirement
      image={
        shouldRenderImage ? (
          nftImage
        ) : (
          <Text as="span" fontWeight="bold" fontSize="xs">
            NFT
          </Text>
        )
      }
      isImageLoading={nftDataLoading}
      footer={<OpenseaUrl />}
      {...props}
    >
      {"Own "}
      {requirement.data?.id
        ? "the "
        : requirement.data?.maxAmount > 0
        ? `${requirement.data?.minAmount}-${requirement.data?.maxAmount}`
        : requirement.data?.minAmount > 1
        ? `at least ${requirement.data?.minAmount} `
        : "a(n) "}

      {nftName ||
        (!requirement.name || requirement.name === "-"
          ? metadata?.slug ?? (
              <DataBlock>{shortenHex(requirement.address, 3)}</DataBlock>
            )
          : requirement.name !== "-" && requirement.name)}

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
