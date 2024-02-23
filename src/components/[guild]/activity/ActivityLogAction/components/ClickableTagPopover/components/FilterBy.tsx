import Button from "components/common/Button"
import {
  Filter,
  FILTER_NAMES,
  useActivityLogFilters,
} from "components/[guild]/activity/ActivityLogFiltersBar/components/ActivityLogFiltersContext"
import { Funnel } from "phosphor-react"

type Props = {
  filter: Omit<Filter, "id">
}

const FilterBy = ({ filter: filterProp }: Props): JSX.Element => {
  const filtersContext = useActivityLogFilters()
  const { activeFilters, addFilter } = filtersContext ?? {}

  const isDisabled =
    !filtersContext ||
    !!activeFilters.find(
      (f) => f.filter === filterProp.filter && f.value === filterProp.value
    )

  return (
    <Button
      variant="ghost"
      leftIcon={<Funnel />}
      size="sm"
      borderRadius={0}
      onClick={() => addFilter(filterProp)}
      isDisabled={isDisabled}
      justifyContent="start"
    >
      {`Filter by ${FILTER_NAMES[filterProp.filter].toLowerCase()}`}
    </Button>
  )
}

export default FilterBy
