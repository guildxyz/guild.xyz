import { HStack, Text } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import DataBlock from "components/common/DataBlock"
import { ProvidedValueDisplayProps } from "requirements"
import { GUILD_PIN_CONTRACTS } from "utils/guildCheckout/constants"
import useNftMetadata, { useNftMetadataWithTraits } from "./useNftMetadata"

function hasOnlyTypeProperty(obj) {
  const keys = Object.keys(obj)
  return keys.length === 1 && keys[0] === "type"
}

const NftAmountProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  if (hasOnlyTypeProperty(requirement)) return "Amount of NFT held"

  const isGuildPin =
    GUILD_PIN_CONTRACTS[requirement.chain] === requirement.address.toLowerCase()
  const guildIdAttribute =
    isGuildPin &&
    requirement.data?.attributes?.find((attr) => attr.trait_type === "guildId")
      ?.value

  const { name: guildPinGuildName } = useGuild(guildIdAttribute ?? "")

  const { metadata: metadataWithTraits } = useNftMetadata(
    requirement.chain,
    requirement.address,
    requirement.data?.id
  )
  const { metadata } = useNftMetadataWithTraits(
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

  return (
    <HStack wrap={"wrap"} gap={1}>
      <Text>Amount of {nftName ?? ""} NFT held</Text>
    </HStack>
  )
}

export default NftAmountProvidedValue
