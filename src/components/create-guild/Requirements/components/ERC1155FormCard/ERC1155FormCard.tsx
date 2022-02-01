import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { RequirementFormField } from "types"
import ChainPicker from "../ChainPicker"

type Props = {
  index: number
  field: RequirementFormField
}

const ERC1155FormCard = ({ index, field }: Props): JSX.Element => {
  const {
    setValue,
    clearErrors,
    formState: { touchedFields },
  } = useFormContext()

  // Reset form on chain change
  const resetForm = () => {
    if (!touchedFields?.requirements?.[index]?.address) return
    setValue(`requirements.${index}.address`, null)
    clearErrors([`requirements.${index}.address`])
  }

  return (
    <>
      <ChainPicker
        controlName={`requirements.${index}.chain` as const}
        defaultChain={field.chain}
        onChange={resetForm}
      />

      <FormControl>
        <FormLabel>Token:</FormLabel>
        <Input placeholder="Coming soon" isDisabled />
      </FormControl>
    </>
  )
}

export default ERC1155FormCard
