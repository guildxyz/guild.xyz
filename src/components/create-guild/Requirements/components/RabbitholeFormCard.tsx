import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Controller, useFormContext } from "react-hook-form"
import { Requirement, SelectOption } from "types"

type Props = {
  index: number
  field: Requirement
}

const optionLevel = [{ label: "Intro", value: "Intro" }]

const optionTopic = [
  { label: "DeFi", value: "DeFi" },
  { label: "NFTs", value: "NFTs" },
  { label: "DAOs", value: "DAOs" },
]

const optionId = [
  { label: "Intro to DeFi", value: "Intro to DeFi" },
  { label: "Intro to NFTs", value: "Intro to NFTs" },
  { label: "Intro to DAOs", value: "Intro to DAOs" },
]

const rabbitholeAddresses = {
  "Intro to DeFi": "0x2fAcE815247A997eAa29881C16F75FD83f4Df65b",
  "Intro to NFTs": "0xa3B61c077dA9Da080D22A4cE24f9Fd5f139634cA",
  "Intro to DAOs": "0xc9A42690912F6Bd134DBc4e2493158b3D72cAd21",
}

const RabbitholeFormCard = ({ index, field }: Props) => {
  const baseFieldName = `requirements.${index}.data`

  //const { register, setValue } = useFormContext()

  //const [getId, setId] = useWatch({ name: `${baseFieldName}.id` })

  const {
    control,
    formState: { errors },
    register,
    setValue,
  } = useFormContext()

  return (
    <>
      <FormControl isRequired isInvalid={errors?.requirements?.[index]?.data?.id}>
        <FormLabel>NFT:</FormLabel>
        <Controller
          name={`${baseFieldName}.id`}
          control={control}
          defaultValue={field.data?.id ?? ""}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              options={optionId}
              value={optionId?.find((option) => option.value === value) ?? ""}
              placeholder="Choose..."
              onChange={(newSelectedOption: SelectOption) => {
                onChange(newSelectedOption?.value)
                setValue(
                  `requirements.${index}.address`,
                  rabbitholeAddresses[newSelectedOption?.value.toString()]
                )
              }}
              onBlur={onBlur}
            />
          )}
        />
        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
      <FormLabel>Courses:</FormLabel>
      <FormControl>
        <Controller
          name={`${baseFieldName}.params.0.value`}
          control={control}
          defaultValue={field.data?.params?.[0]?.value ?? ""}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              options={optionLevel}
              value={optionLevel?.find((option) => option.value === value) ?? ""}
              placeholder="Trait topic"
              onChange={(newSelectedOption: SelectOption) => {
                setValue(`requirements.${index}.data.params.0.trait_type`, "Level")
                onChange(newSelectedOption?.value)
              }}
              onBlur={onBlur}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <Controller
          name={`${baseFieldName}.params.1.value`}
          control={control}
          defaultValue={field.data?.params?.[1]?.value ?? ""}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              options={optionTopic}
              value={optionTopic?.find((option) => option.value === value) ?? ""}
              placeholder="Trait type"
              onChange={(newSelectedOption: SelectOption) => {
                setValue(`requirements.${index}.data.params.1.trait_type`, "Topic")
                onChange(newSelectedOption?.value)
              }}
              onBlur={onBlur}
            />
          )}
        />
      </FormControl>
    </>
  )
}

export default RabbitholeFormCard
