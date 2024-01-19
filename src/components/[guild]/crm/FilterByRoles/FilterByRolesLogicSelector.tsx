import RadioButtonGroup, { RadioButton } from "components/common/RadioButtonGroup"

const options = [
  {
    label: "Should satisfy some",
    value: "some",
  },
  {
    label: "Should satisfy all",
    value: "all",
  },
]

const FilterByRolesLogicSelector = ({ column }) => (
  <RadioButtonGroup
    options={options}
    renderOption={(option, radioProps) => (
      <RadioButton {...option} {...radioProps} borderRadius="md" w="full" />
    )}
    radioGroupProps={{
      onChange: (newValue) => {
        {
          column.setFilterValue((prevValue) => ({
            ...prevValue,
            logic: newValue,
          }))
        }
      },
      value: (column.getFilterValue() as any)?.logic,
      defaultValue: "some",
    }}
    buttonGroupStyleProps={{ size: "xs", mb: "3", w: "full", spacing: 1.5 }}
  />
)

export default FilterByRolesLogicSelector
