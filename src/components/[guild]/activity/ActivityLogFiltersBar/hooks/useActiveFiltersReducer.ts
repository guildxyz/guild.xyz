import { useReducer } from "react"
import { Filter } from "../components/ActivityLogFiltersContext"

type Action = {
  type:
    | "addFilter"
    | "updateFilter"
    | "removeFilter"
    | "removeLastFilter"
    | "setFilters"
    | "clearFilters"
  filter?: Filter
  filters?: Filter[]
}

const activeFiltersReducer = (activeFilters: Filter[], action: Action) => {
  switch (action.type) {
    case "addFilter":
      return [...activeFilters, action.filter]
    case "updateFilter": {
      const modifiedFilters = [...activeFilters]
      const filterToModify = modifiedFilters.find(
        (f) => f.filter === action.filter?.filter
      )
      if (filterToModify) {
        filterToModify.value = action.filter.value
      }

      return modifiedFilters
    }
    case "removeFilter":
      return [...activeFilters.filter((f) => f.filter !== action.filter?.filter)]
    case "removeLastFilter": {
      const modifiedFilters = [...activeFilters]
      modifiedFilters.pop()
      return modifiedFilters
    }
    case "setFilters":
      return action.filters
    case "clearFilters":
      return []
    default:
      throw Error(`Unknown action: ${action.type}`)
  }
}

export const useActiveFiltersReducer = (initialValue: Filter[] = []) =>
  useReducer(activeFiltersReducer, initialValue)
