import RadioButtonGroup from "components/common/RadioButtonGroup"

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
    onChange={(newValue) => {
      column.setFilterValue((prevValue) => ({
        ...prevValue,
        logic: newValue,
      }))
    }}
    value={(column.getFilterValue() as any)?.logic}
    defaultValue={"some"}
    chakraStyles={{ size: "xs", mb: "3", w: "full", spacing: 1.5 }}
  />
)

export default FilterByRolesLogicSelector
