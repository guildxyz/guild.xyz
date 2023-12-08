import useGuild from "components/[guild]/hooks/useGuild"
import { Visibility } from "types"
import { VISIBILITY_DATA } from "../visibilityData"

const useVisibilityTooltipLabel = (
  visibility: Visibility,
  visibilityRoleId: number
) => {
  const { roles } = useGuild()
  const roleName =
    visibilityRoleId && visibility === Visibility.PRIVATE
      ? roles?.find(({ id }) => id === visibilityRoleId)?.name
      : undefined

  const tooltipDescription =
    visibility !== Visibility.PRIVATE
      ? VISIBILITY_DATA[visibility].description
      : !visibilityRoleId
      ? "Only visible to role holders"
      : `Only visible to users that satisfy the ${
          roleName ? `"${roleName}"` : "selected"
        } role`

  return `${VISIBILITY_DATA[visibility].title}: ${tooltipDescription}`
}

export default useVisibilityTooltipLabel
