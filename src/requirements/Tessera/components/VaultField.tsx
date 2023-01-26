import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import useTesseraVaults from "../hooks/useTesseraVaults"

const VaultField = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()
  const { data, isLoading } = useTesseraVaults()

  const vaults =
    data?.map((vault) => ({
      label: vault.name,
      value: vault.slug,
      img: vault.imageUrl,
    })) ?? []

  const vault = useWatch({ name: `${baseFieldPath}.data.vault` })

  const selectedVault = vaults?.find((v) => v.value === vault)

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

        <ControlledSelect
          name={`${baseFieldPath}.data.vault`}
          rules={{ required: "This field is required." }}
          options={vaults}
          isLoading={isLoading}
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
