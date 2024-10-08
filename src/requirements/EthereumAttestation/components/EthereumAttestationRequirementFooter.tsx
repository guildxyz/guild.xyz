import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import { RequirementLink } from "components/[guild]/Requirements/components/RequirementButton"
import { RequirementChainIndicator } from "components/[guild]/Requirements/components/RequirementChainIndicator"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"

export const EAS_SCAN_BASE = {
  ARBITRUM: "https://arbitrum.easscan.org/schema/view",
  OPTIMISM: "https://optimism.easscan.org/schema/view",
  ETHEREUM: "https://easscan.org/schema/view",
  SEPOLIA: "https://sepolia.easscan.org/schema/view",
  BASE_GOERLI: "https://base-goerli.easscan.org/schema/view",
  BASE_SEPOLIA: "https://base-sepolia.easscan.org/schema/view",
  BASE_MAINNET: "https://base.easscan.org/schema/view",
  LINEA: "https://linea.easscan.org/schema/view",
} as const

const EthereumAttestationRequirementFooter = () => {
  const { type, data, chain } = useRequirementContext<
    "COINBASE_EAS_ATTESTED_BY" | "EAS_ATTESTED_BY" | "EAS_ATTEST"
  >()

  return (
    <>
      <RequirementChainIndicator />

      <RequirementLink
        href={`${EAS_SCAN_BASE[chain ?? "ETHEREUM"]}/${data?.schemaId}`}
        imageUrl="/requirementLogos/eas.png"
        label="Schema"
        className="ml-1"
      />

      <BlockExplorerUrl
        path="address"
        address={type === "EAS_ATTEST" ? data.recipient : data.attester}
        label={type === "EAS_ATTEST" ? "Recipient" : "Attester"}
        className="mx-1"
      />
    </>
  )
}

export { EthereumAttestationRequirementFooter }
