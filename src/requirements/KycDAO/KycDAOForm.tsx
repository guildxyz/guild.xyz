import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import ChainInfo from "../common/ChainInfo"
import useKycDAOContracts from "./hooks/useKycDAOContracts"

const KycDAOForm = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()

  useController({
    name: `${baseFieldPath}.chain`,
    defaultValue: "POLYGON",
  })

  const { isLoading, kycDAOContracts } = useKycDAOContracts()

  return (
    <Stack spacing={4} alignItems="start">
      <ChainInfo>Works on Polygon</ChainInfo>

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.address}
      >
        <FormLabel>Contract:</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.address`}
          rules={{
            required: "This field is required.",
          }}
          isClearable
          isLoading={isLoading}
          options={kycDAOContracts}
          placeholder="Select one"
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default KycDAOForm
