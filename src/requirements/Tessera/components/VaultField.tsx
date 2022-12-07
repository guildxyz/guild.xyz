import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import useTesseraVaults from "../hooks/useTesseraVaults"

const VaultField = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()
  const { vaults, isLoading } = useTesseraVaults()

  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `${baseFieldPath}.data.vault`,
    rules: { required: "This field is required." },
  })

  const selectedVault = vaults?.find((v) => v.value === value)

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.vault}
    >
      <FormLabel>Vault</FormLabel>

      <InputGroup>
        {selectedVault && (
          <InputLeftElement>
            <OptionImage img={selectedVault.img} alt={selectedVault.label} />
          </InputLeftElement>
        )}
        <StyledSelect
          ref={ref}
          name={name}
          options={vaults}
          isLoading={isLoading}
          onChange={(newValue: { label: string; value: string }) => {
            onChange(newValue?.value)
          }}
          value={selectedVault ?? ""}
          onBlur={onBlur}
          isClearable
        />
      </InputGroup>

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.vault?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default VaultField
