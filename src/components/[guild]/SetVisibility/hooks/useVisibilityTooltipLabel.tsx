import { Visibility } from "@guildxyz/types"
import RoleTag from "components/[guild]/RoleTag"
import useGuild from "components/[guild]/hooks/useGuild"
import { ReactNode } from "react"
import { VISIBILITY_DATA } from "../visibilityData"

const useVisibilityTooltipLabel = (
  visibility: Visibility,
  visibilityRoleId: number
): ReactNode => {
  const { roles } = useGuild()
  const role =
    visibilityRoleId && visibility === "PRIVATE"
      ? roles?.find(({ id }) => id === visibilityRoleId)
      : undefined

  const tooltipDescription =
    visibility !== "PRIVATE" ? (
      (VISIBILITY_DATA[visibility]?.description ??
      VISIBILITY_DATA.PUBLIC.description)
    ) : !visibilityRoleId ? (
      "Only visible to role holders"
    ) : (
      <>
        Only visible to users that satisfy the
        {role ? (
          <RoleTag
            size={"sm"}
            bgColor={"blackAlpha.600"}
            name={role.name}
            imageUrl={role.imageUrl}
          />
        ) : (
          "selected"
        )}{" "}
        role
      </>
    )

  return (
    <>
      {VISIBILITY_DATA[visibility]?.title ?? "Public"}: {tooltipDescription}
    </>
  )
}

export default useVisibilityTooltipLabel
