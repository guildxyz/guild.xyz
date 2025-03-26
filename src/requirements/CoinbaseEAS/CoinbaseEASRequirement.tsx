import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import CountryFlagAndName from "requirements/CoinbaseEAS/components/CountryFlagAndName"
import { EthereumAttestationRequirementFooter } from "requirements/EthereumAttestation/components/EthereumAttestationRequirementFooter"
import { EAS_CB_VERIFIED_ACCOUNT_SCHEMA_ID } from "./constants"

const CoinbaseEASRequirement = (props: RequirementProps): JSX.Element => {
  const { data } = useRequirementContext()

  return (
    <Requirement
      image={<img src="/requirementLogos/coinbase.png" />}
      footer={<EthereumAttestationRequirementFooter />}
      {...props}
    >
      {data.schemaId === EAS_CB_VERIFIED_ACCOUNT_SCHEMA_ID ? (
        "Verify your account"
      ) : (
        <>
          <span>Verify your country</span>
          {data.val && <CountryFlagAndName code={data.val} />}
        </>
      )}
    </Requirement>
  )
}

export default CoinbaseEASRequirement
