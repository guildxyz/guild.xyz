import { GroupBase, Select } from "chakra-react-select"
import { Dispatch, SetStateAction } from "react"

export type FilterOption = {
  value: string
  label: string
  colorScheme?: string
}

type Props = {
  filter: Array<FilterOption>
  setFilter: Dispatch<SetStateAction<FilterOption[]>>
  filterPages: any // TODO: type
}

const MultiSelect = ({ filter, filterPages }: Props): JSX.Element => (
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
    onChange={(e) => filterPages(e)}
  />
)

export default MultiSelect
