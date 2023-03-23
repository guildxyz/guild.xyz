import dynamic from "next/dynamic"
import { FILTER_OPTIONS } from "pages/guildverse"

export type FilterOption = {
  value: string
  label: string
}

type Props = {
  setFilterData
}

const DynamicStyledSelect = dynamic(() => import("components/common/StyledSelect"))

const FilterSelect = ({ setFilterData }: Props): JSX.Element => {
  if (typeof window === "undefined") return null
  return (
    <DynamicStyledSelect
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
}

export default FilterSelect
