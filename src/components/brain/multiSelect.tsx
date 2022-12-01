import { GroupBase, Select } from "chakra-react-select"

export type FilterOption = {
  value: string
  label: string
  colorScheme?: string
}

type Props = {
  filterOptions: Array<FilterOption>
  setFilterData
}

const MultiSelect = ({ filterOptions, setFilterData }: Props): JSX.Element => (
  <Select<FilterOption, true, GroupBase<FilterOption>>
    isMulti
    options={filterOptions}
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

export default MultiSelect
