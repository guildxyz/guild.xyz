import { HStack, Wrap } from "@chakra-ui/react"
import BlockExplorerUrl from "components/[guild]/Requirements/components/BlockExplorerUrl"
import { RequirementLinkButton } from "components/[guild]/Requirements/components/RequirementButton"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"

export const EAS_SCAN_BASE = {
  ARBITRUM: "https://arbitrum.easscan.org/schema/view",
  OPTIMISM: "https://optimism.easscan.org/schema/view",
  ETHEREUM: "https://easscan.org/schema/view",
  SEPOLIA: "https://sepolia.easscan.org/schema/view",
  BASE_GOERLI: "https://base-goerli.easscan.org/schema/view",
  BASE_SEPOLIA: "https://base-sepolia.easscan.org/schema/view",
  BASE_MAINNET: "https://base.easscan.org/schema/view",
} as const

const EthereumAttestationRequirementFooter = () => {
  const { type, data, chain } = useRequirementContext()

  return (
    <Wrap spacing={4} spacingY={2}>
      <RequirementChainIndicator />
      <HStack spacing={4}>
        <RequirementLinkButton
          href={`${EAS_SCAN_BASE[chain ?? "ETHEREUM"]}/${data?.schemaId}`}
          imageUrl="/requirementLogos/eas.png"
        >
          Schema
        </RequirementLinkButton>
        <BlockExplorerUrl
          path="address"
          address={data?.attester ?? data?.recipient}
          label={type === "EAS_ATTEST" ? "Recipient" : "Attester"}
        />
      </HStack>
    </Wrap>
  )
}

export default EthereumAttestationRequirementFooter
