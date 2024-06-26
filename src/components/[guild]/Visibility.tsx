import { Tag, TagLabel, TagLeftIcon, TagProps, Tooltip } from "@chakra-ui/react"
import { Visibility as VisibilityType } from "@guildxyz/types"
import useVisibilityTooltipLabel from "./SetVisibility/hooks/useVisibilityTooltipLabel"
import { VISIBILITY_DATA } from "./SetVisibility/visibilityData"

type Props = {
  entityVisibility: VisibilityType
  visibilityRoleId: number | null
  showTagLabel?: boolean
} & TagProps

const Visibility = ({
  entityVisibility,
  visibilityRoleId,
  showTagLabel,
  ...tagProps
}: Props) => {
  const VisibilityIcon = VISIBILITY_DATA[entityVisibility].Icon

  const label = useVisibilityTooltipLabel(entityVisibility, visibilityRoleId)

  if (entityVisibility === "PUBLIC") return null

  return (
    <Tooltip label={label}>
      <Tag
        bg={showTagLabel ? undefined : "unset"}
        color={showTagLabel ? undefined : "gray"}
        {...tagProps}
      >
        <TagLeftIcon as={VisibilityIcon} boxSize={3.5} />
        {showTagLabel && (
          <TagLabel>{VISIBILITY_DATA[entityVisibility].title}</TagLabel>
        )}
      </Tag>
    </Tooltip>
  )
}

export default Visibility
