import { Img, Text } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import CountryFlagAndName from "requirements/CoinbaseEAS/components/CountryFlagAndName"
import EthereumAttestationRequirementFooter from "requirements/EthereumAttestation/components/EthereumAttestationRequirementFooter"
import { EAS_CB_VERIFIED_ACCOUNT_SCHEMA_ID } from "./CoinbaseEASForm"

const CoinbaseEASRequirement = (props: RequirementProps): JSX.Element => {
  const { data } = useRequirementContext()

  return (
    <Requirement
      image={<Img src="/requirementLogos/coinbase.png" />}
      footer={<EthereumAttestationRequirementFooter />}
      {...props}
    >
      {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
      {data.schemaId === EAS_CB_VERIFIED_ACCOUNT_SCHEMA_ID ? (
        <Text as="span">Verify your account</Text>
      ) : (
        <>
          <Text as="span">Verify your country</Text>
          {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
          {data.val && <CountryFlagAndName code={data.val} />}
        </>
      )}
    </Requirement>
  )
}

export default CoinbaseEASRequirement
