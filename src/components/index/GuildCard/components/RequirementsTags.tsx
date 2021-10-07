import { Tag, TagLabel } from "@chakra-ui/react"
import { useMemo } from "react"
import { Requirement } from "temporaryData/types"

type Props = {
  requirements?: Array<Requirement>
}

const RequirementsTags = ({ requirements }: Props): JSX.Element => {
  const shoulRenderSymbols = useMemo(() => {
    // if (!guildData.levels?.[0]?.requirements?.length) return false
    if (!requirements?.length) return false

    const requirementTypesSet = new Set(
      requirements.map((requirement) => requirement.type)
    )
    if (requirementTypesSet.size > requirements.length) return false

    // If there are multiple requirements with the same type, don't render symbols, just render e.g. "2 TOKENs"
    return true
  }, [requirements])

  return (
    <>
      {shoulRenderSymbols
        ? requirements.map((requirement) => {
            if (!["POAP", "SNAPSHOT"].includes(requirement.type))
              return (
                <Tag as="li">
                  <TagLabel>
                    {["TOKEN", "ETHER"].includes(requirement.type)
                      ? `${requirement.value} ${requirement.symbol}`
                      : `${
                          requirement.symbol === "-" &&
                          requirement.address?.toLowerCase() ===
                            "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"
                            ? "ENS"
                            : requirement.symbol
                        }`}
                  </TagLabel>
                </Tag>
              )
          })
        : [
            "TOKEN",
            "ETHER",
            "NFT",
            "OPENSEA",
            "COOLCATS",
            "LOOT",
            "BAYC",
            "MUTAGEN",
            "CRYPTOPUNKS",
          ].map((requirementType) => {
            const count = requirements.filter(
              (r) => r.type === requirementType
            ).length

            if (count > 0)
              return (
                <Tag as="li" key={requirementType}>
                  <TagLabel>
                    {`${count} ${requirementType}${count > 1 ? "s" : ""}`}
                  </TagLabel>
                </Tag>
              )
          })}

      {(() => {
        // We always display POAPs this way, because they have long names
        const poapRequirementsCount =
          requirements?.filter((req) => req.type === "POAP").length || 0
        if (poapRequirementsCount)
          return (
            <Tag as="li">
              <TagLabel>{`${poapRequirementsCount} POAP${
                poapRequirementsCount > 1 ? "s" : ""
              }`}</TagLabel>
            </Tag>
          )
      })()}

      {(() => {
        // We always display SNAPSHOTs this way, because they have long names
        const snapshotRequirementsCount =
          requirements?.filter((req) => req.type === "SNAPSHOT").length || 0
        if (snapshotRequirementsCount)
          return (
            <Tag as="li">
              <TagLabel>{`${snapshotRequirementsCount} SNAPSHOT${
                snapshotRequirementsCount > 1 ? "s" : ""
              }`}</TagLabel>
            </Tag>
          )
      })()}
    </>
  )
}

export default RequirementsTags
