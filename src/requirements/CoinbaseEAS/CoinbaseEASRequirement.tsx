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
      image={<Img src="/requirementLogos/eas.png" maxWidth={8} maxHeight={8} />}
      footer={<EthereumAttestationRequirementFooter />}
      {...props}
    >
      {data.schemaId === EAS_CB_VERIFIED_ACCOUNT_SCHEMA_ID ? (
        <Text as="span">Verify your account</Text>
      ) : (
        <>
          <Text as="span">Verify your country</Text>
          {data.val && <CountryFlagAndName code={data.val} />}
        </>
      )}
    </Requirement>
  )
}

export default CoinbaseEASRequirement
