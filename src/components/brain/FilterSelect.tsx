import dynamic from "next/dynamic"
import { filterOptions } from "pages/guildverse"

export type FilterOption = {
  value: string
  label: string
}

const DynamicStyledSelect = dynamic(() => import("components/common/StyledSelect"))

const FilterSelect = ({ setFilterData }): JSX.Element => {
  if (typeof window === "undefined") return null
  return (
    <DynamicStyledSelect
      isMulti
      instanceId="filter-select"
      options={filterOptions}
      placeholder="Filter"
      chakraStyles={{
        control: (provided) => ({
          ...provided,
          minH: "12",
          borderRadius: "xl",
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 2,
        }),
      }}
      onChange={(e) => setFilterData(e)}
    />
  )
}

export default FilterSelect
