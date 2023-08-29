import { Divider, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import EthereumAttestation from "./components/EthereumAttestation"

const typeOptions = [
  {
    value: "EAS_ATTESTED_BY",
    label: "Be attested by",
  },
  {
    value: "EAS_ATTEST",
    label: "Attest",
  },
]

const EthereumAttestationForm = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => {
  const {
    resetField,
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const resetFields = () => {
    resetField(`${baseFieldPath}.data.schemaId`)
    resetField(`${baseFieldPath}.data.attester`)
    resetField(`${baseFieldPath}.data.recipient`)
    resetField(`${baseFieldPath}.data.key`)
    resetField(`${baseFieldPath}.data.val`)
  }

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={typeOptions}
          beforeOnChange={resetFields}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {!!type && (
        <>
          <Divider />
          <EthereumAttestation baseFieldPath={baseFieldPath} />
        </>
      )}
    </Stack>
  )
}

export default EthereumAttestationForm
