import { HStack, Text } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import DataBlock from "components/common/DataBlock"
import { ProvidedValueDisplayProps } from "requirements"
import { GUILD_PIN_CONTRACTS } from "utils/guildCheckout/constants"
import useNftMetadata, { useNftMetadataWithTraits } from "../hooks/useNftMetadata"

export function hasOnlyTypeProperty(obj) {
  const keys = Object.keys(obj)
  return keys.length === 1 && keys[0] === "type"
}

const NftAmountProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  const isGuildPin =
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    GUILD_PIN_CONTRACTS[requirement.chain] === requirement?.address?.toLowerCase()
  const guildIdAttribute =
    isGuildPin &&
    requirement.data?.attributes?.find((attr) => attr.trait_type === "guildId")
      ?.value

  const { name: guildPinGuildName } = useGuild(guildIdAttribute ?? "")

  const { metadata: metadataWithTraits } = useNftMetadata(
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    requirement.chain,
    requirement.address,
    requirement.data?.id
  )
  const { metadata } = useNftMetadataWithTraits(
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    requirement.chain,
    requirement.address
  )

  const nftName = isGuildPin ? (
    <>
      {guildPinGuildName && (
        <>
          <DataBlock>{guildPinGuildName}</DataBlock>
        </>
      )}
      <Text as="span">{" Guild Pin"}</Text>
    </>
  ) : (
    metadataWithTraits?.name || metadata?.name
  )

  if (hasOnlyTypeProperty(requirement)) return "Amount of NFT held"

  return (
    <HStack wrap={"wrap"} gap={1}>
      <Text>Amount of {nftName ?? ""} NFT held</Text>
    </HStack>
  )
}

export default NftAmountProvidedValue
