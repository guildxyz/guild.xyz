import { GroupBase, Select } from "chakra-react-select"
import { FILTER_OPTIONS } from "pages/guildverse"

export type FilterOption = {
  value: string
  label: string
}

type Props = {
  setFilterData
}

const FilterSelect = ({ setFilterData }: Props): JSX.Element => (
  <Select<FilterOption, true, GroupBase<FilterOption>>
    isMulti
    instanceId="filter-select"
    options={FILTER_OPTIONS}
    placeholder="Filter"
    chakraStyles={{
      control: (provided) => ({
        ...provided,
        minH: "48px",
        borderRadius: "0.75rem",
      }),
      menu: (provided) => ({
        ...provided,
        zIndex: 2,
      }),
    }}
    onChange={(e) => setFilterData(e)}
  />
)

export default FilterSelect
