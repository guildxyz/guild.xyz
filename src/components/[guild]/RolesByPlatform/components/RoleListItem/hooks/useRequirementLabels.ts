import { useMemo } from "react"
import { Requirement } from "types"
import pluralize from "utils/pluralize"

const useRequirementLabels = (requirements?: Array<Requirement>): Array<string> => {
  const shoulRenderSymbols = useMemo(() => {
    if (!requirements?.length) return false

    const requirementTypesSet = new Set(
      requirements.map((requirement) => requirement.type)
    )
    if (requirementTypesSet.size > requirements.length) return false

    // If there are multiple requirements with the same type, don't render symbols, just render e.g. "2 TOKENs"
    return true
  }, [requirements])

  const baseReqs = shoulRenderSymbols
    ? requirements.map((requirement) => {
        if (
          !["POAP", "MIRROR", "UNLOCK", "SNAPSHOT", "ALLOWLIST"].includes(
            requirement.type
          )
        )
          return ["ERC20", "COIN"].includes(requirement.type)
            ? `${requirement.data?.amount} ${requirement.symbol}`
            : `${
                requirement.symbol === "-" &&
                requirement.address?.toLowerCase() ===
                  "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"
                  ? "ENS"
                  : requirement.symbol !== "-"
                  ? requirement.symbol
                  : requirement.type === "ERC721" || requirement.type === "ERC1155"
                  ? "NFT"
                  : requirement.type === "FREE"
                  ? "Free entry"
                  : requirement.type
              }`
      })
    : ["ERC20", "COIN", "ERC721", "ERC1155", "FREE"].map((requirementType) => {
        const count =
          requirements?.filter((r) => r.type === requirementType).length || 0

        if (count > 0)
          return pluralize(
            count,
            requirementType === "ERC721" || requirementType === "ERC1155"
              ? "NFT"
              : requirementType
          )
      })

  const poapReqs = (() => {
    // We always display POAPs this way, because they have long names
    const poapRequirementsCount =
      requirements?.filter((req) => req.type === "POAP").length || 0
    if (poapRequirementsCount) return pluralize(poapRequirementsCount, "POAP")
  })()

  const mirrorReqs = (() => {
    // We always display Mirror editions this way, because they have long names
    const mirrorRequirementsCount =
      requirements?.filter((req) => req.type === "MIRROR").length || 0
    if (mirrorRequirementsCount)
      return pluralize(mirrorRequirementsCount, "Mirror Edition")
  })()

  const unlockReqs = (() => {
    // We always display Unlocks this way, because they have long names
    const unlockRequirementsCount =
      requirements?.filter((req) => req.type === "UNLOCK").length || 0
    if (unlockRequirementsCount)
      return pluralize(unlockRequirementsCount, "Unlock NFT")
  })()

  const snapshotReqs = (() => {
    // We always display SNAPSHOTs this way, because they have long names
    const snapshotRequirementsCount =
      requirements?.filter((req) => req.type === "SNAPSHOT").length || 0
    if (snapshotRequirementsCount)
      return pluralize(snapshotRequirementsCount, "SNAPSHOT")
  })()

  const juiceboxReqs = (() => {
    // We always display JUICEBOXes this way, because they have long names
    const juiceboxRequirementsCount =
      requirements?.filter((req) => req.type === "JUICEBOX").length || 0
    if (juiceboxRequirementsCount)
      return pluralize(juiceboxRequirementsCount, "Juicebox ticket")
  })()

  const allowlistReq = (() =>
    requirements?.find((req) => req.type === "ALLOWLIST") ? "ALLOWLIST" : null)()

  return [
    ...baseReqs,
    poapReqs,
    mirrorReqs,
    unlockReqs,
    snapshotReqs,
    juiceboxReqs,
    allowlistReq,
  ].filter(Boolean)
}

export default useRequirementLabels
