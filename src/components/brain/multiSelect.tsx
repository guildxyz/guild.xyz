import { GroupBase, Select } from "chakra-react-select"

export type FilterOption = {
  value: string
  label: string
  colorScheme?: string
}

type Props = {
  filter: Array<FilterOption>
  setFilterData
}

const MultiSelect = ({ filter, setFilterData }: Props): JSX.Element => (
  <Select<FilterOption, true, GroupBase<FilterOption>>
    isMulti
    options={filter}
    placeholder="Filter pages"
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
