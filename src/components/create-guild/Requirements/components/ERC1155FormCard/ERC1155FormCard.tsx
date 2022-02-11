import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext } from "react-hook-form"
import { RequirementFormField } from "types"
import ChainPicker from "../ChainPicker"

type Props = {
  index: number
  field: RequirementFormField
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const ERC1155FormCard = ({ index, field }: Props): JSX.Element => {
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors, touchedFields },
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

      <FormControl isRequired isInvalid={errors?.requirements?.[index]?.address}>
        <FormLabel>Token:</FormLabel>
        <Input
          placeholder="Paste address"
          {...register(`requirements.${index}.address`, {
            required: "This field is required.",
            pattern: {
              value: ADDRESS_REGEX,
              message:
                "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
            },
          })}
        />
        <FormErrorMessage>
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default ERC1155FormCard
