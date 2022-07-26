import { Divider, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { useController, useFormState } from "react-hook-form"
import { Requirement } from "types"
import Following from "./components/Following"
import SearchValue from "./components/SearchValue"

type Props = {
  index: number
  field: Requirement
}

const twitterRequirementTypes = [
  {
    label: "Follow somebody",
    value: "FOLLOWING",
    TwitterRequirement: Following,
  },
  {
    label: "Username includes text",
    value: "USERNAME",
    TwitterRequirement: SearchValue,
  },
  {
    label: "Bio includes text",
    value: "BIO",
    TwitterRequirement: SearchValue,
  },
]

const TwitterFormCard = ({ index, field }: Props) => {
  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    name: `requirements.${index}.data.type`,
    rules: { required: "It's required to select a type" },
  })

  const { errors } = useFormState()

  const selected = twitterRequirementTypes.find((reqType) => reqType.value === value)

  return (
    <>
      <FormControl isInvalid={!!errors?.requirements?.[index]?.data?.type?.message}>
        <FormLabel>Type</FormLabel>
        <StyledSelect
          options={twitterRequirementTypes}
          name={name}
          onBlur={onBlur}
          onChange={(newValue: { label: string; value: string }) => {
            onChange(newValue?.value)
          }}
          ref={ref}
          value={selected}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.type?.message}
        </FormErrorMessage>
      </FormControl>

      <Divider />

      {selected?.TwitterRequirement && <selected.TwitterRequirement index={index} />}
    </>
  )
}

export default TwitterFormCard
