import { FormControl } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { useController } from "react-hook-form"
import { SelectOption } from "types"
import capitalize from "utils/capitalize"

const FEATURE_FLAGS = ["PURCHASE_REQUIREMENT", "PAYMENT_REQUIREMENT"] as const
export type FeatureFlag = (typeof FEATURE_FLAGS)[number]

const generateLabel = (flag: FeatureFlag) =>
  flag
    .toLowerCase()
    .split("_")
    .map((word) => capitalize(word))
    .join(" ")

const FeatureFlags = (): JSX.Element => {
  const options: SelectOption<FeatureFlag>[] = FEATURE_FLAGS.map((flag) => ({
    label: generateLabel(flag),
    value: flag,
  }))

  const {
    field: { ref, name, onChange, onBlur },
  } = useController({ name: "featureFlags" })

  return (
    <FormControl>
      <StyledSelect
        ref={ref}
        name={name}
        isMulti
        options={options}
        onChange={(selectedOption: (SelectOption | string)[]) => {
          onChange(
            selectedOption.map((option) =>
              typeof option === "string" ? option : option.value
            )
          )
        }}
        onBlur={onBlur}
        chakraStyles={{ valueContainer: (base) => ({ ...base, py: 2 }) }}
      />
    </FormControl>
  )
}

export default FeatureFlags
