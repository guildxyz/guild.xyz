import { HStack, Text } from "@chakra-ui/react"
import { consts } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import DataBlock from "components/common/DataBlock"
import type { ProvidedValueDisplayProps } from "requirements/requirementProvidedValues"
import { isGuildPinSupportedChain } from "utils/guildCheckout/utils"
import { Chain } from "wagmiConfig/chains"
import useNftMetadata, { useNftMetadataWithTraits } from "../hooks/useNftMetadata"

export function hasOnlyTypeProperty(obj) {
  const keys = Object.keys(obj)
  return keys.length === 1 && keys[0] === "type"
}

const NftAmountProvidedValue = ({ requirement }: ProvidedValueDisplayProps) => {
  // TODO: we could remove the cast once we'll have schemas for "ERC..." requirements
  const requirementChain = requirement.chain as Chain
  const requirementAddress = requirement.address as `0x${string}`

  const isGuildPin =
    isGuildPinSupportedChain(requirementChain) &&
    consts.PinContractAddresses[requirementChain] ===
      requirement?.address?.toLowerCase()
  const guildIdAttribute =
    isGuildPin &&
    requirement.data?.attributes?.find((attr) => attr.trait_type === "guildId")
      ?.value

  const { name: guildPinGuildName } = useGuild(guildIdAttribute ?? "")

  const { metadata: metadataWithTraits } = useNftMetadata(
    requirementChain,
    requirementAddress,
    requirement.data?.id
  )
  const { metadata } = useNftMetadataWithTraits(requirementChain, requirementAddress)

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
