import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Controller, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"

const options = [
  { label: "Intro to DeFi", value: "0x2fAcE815247A997eAa29881C16F75FD83f4Df65b" },
  { label: "Intro to NFTs", value: "0xa3B61c077dA9Da080D22A4cE24f9Fd5f139634cA" },
  { label: "Intro to DAOs", value: "0xc9A42690912F6Bd134DBc4e2493158b3D72cAd21" },
]

const RabbitholeForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <FormControl
        isRequired
        isInvalid={parseFromObject(errors, baseFieldPath)?.address}
      >
        <FormLabel>Skill:</FormLabel>
        <Controller
          name={`${baseFieldPath}.address`}
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              options={options}
              value={options?.find((option) => option.value === value) ?? ""}
              placeholder="Choose..."
              onChange={(newSelectedOption: SelectOption) => {
                onChange(newSelectedOption?.value)
              }}
              onBlur={onBlur}
            />
          )}
        />
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default RabbitholeForm
export { options as rabbitholeCourses }
