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

const FilterByRolesLogicSelector = ({ getFilterValue, setFilterValue }) => (
  <RadioButtonGroup
    options={options}
    onChange={(newValue) => {
      setFilterValue((prevValue) => ({
        ...prevValue,
        logic: newValue,
      }))
    }}
    value={getFilterValue()?.logic}
    defaultValue={"some"}
    chakraStyles={{ size: "xs", mb: "3", w: "full", spacing: 1.5 }}
  />
)

export default FilterByRolesLogicSelector
