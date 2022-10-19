import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Controller, useFormContext } from "react-hook-form"
import { Requirement, SelectOption } from "types"

type Props = {
  index: number
  field: Requirement
}

const options = [
  { label: "Intro to DeFi", value: "0x2fAcE815247A997eAa29881C16F75FD83f4Df65b" },
  { label: "Intro to NFTs", value: "0xa3B61c077dA9Da080D22A4cE24f9Fd5f139634cA" },
  { label: "Intro to DAOs", value: "0xc9A42690912F6Bd134DBc4e2493158b3D72cAd21" },
]

const RabbitholeFormCard = ({ index, field }: Props) => {
  const baseFieldName = `requirements.${index}`

  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <FormControl isRequired isInvalid={errors?.requirements?.[index]?.address}>
        <FormLabel>Skill:</FormLabel>
        <Controller
          name={`${baseFieldName}.address`}
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
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default RabbitholeFormCard
export { options as rabbitholeCourses }
