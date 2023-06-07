import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledCombobox } from "components/zag/Combobox"
import { useFormState } from "react-hook-form"
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

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.vault}
    >
      <FormLabel>Vault</FormLabel>

      <ControlledCombobox
        name={`${baseFieldPath}.data.vault`}
        rules={{ required: "This field is required." }}
        options={vaults}
        isLoading={isLoading}
        isClearable
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.vault?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default VaultField
