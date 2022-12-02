import { Text } from "@chakra-ui/react"
import { ImageData } from "@nouns/assets"
import DataBlock from "components/common/DataBlock"
import { Fragment } from "react"
import useSWRImmutable from "swr/immutable"
import { Requirement as RequirementType, Trait } from "types"
import shortenHex from "utils/shortenHex"
import OpenseaUrl from "../common/OpenseaUrl"
import Requirement from "../common/Requirement"
import { NOUNS_BACKGROUNDS } from "./hooks/useNftMetadata"

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
  const requirement = receivedRequirement.data?.attribute
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
        },
      }
    : receivedRequirement

  const { data, isValidating } = useSWRImmutable<{ image: string }>(
    requirement.address ? `/api/opensea-asset-data/${requirement.address}` : null
  )

  const shouldRenderImage =
    requirement.chain === "ETHEREUM" && requirement.name && requirement.name !== "-"

  return (
    <Requirement
      image={
        shouldRenderImage && (isValidating || data?.image) ? (
          isValidating ? (
            ""
          ) : (
            data?.image
          )
        ) : (
          <Text as="span" fontWeight="bold" fontSize="xs">
            NFT
          </Text>
        )
      }
      loading={isValidating}
      footer={<OpenseaUrl requirement={requirement} />}
      {...rest}
    >
      {`Own ${
        requirement.data?.id
          ? `the #${requirement.data.id}`
          : requirement.data?.maxAmount > 0
          ? `${requirement.data?.minAmount}-${requirement.data?.maxAmount}`
          : requirement.data?.minAmount > 1
          ? `at least ${requirement.data?.minAmount}`
          : "a(n)"
      } `}

      {requirement.symbol === "-" &&
      requirement.address?.toLowerCase() ===
        "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85" ? (
        "ENS"
      ) : !requirement.name || requirement.name === "-" ? (
        <DataBlock>{shortenHex(requirement.address, 3)}</DataBlock>
      ) : (
        requirement.name
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
