import { Tag, TagLabel, TagLeftIcon, TagProps, Tooltip } from "@chakra-ui/react"
import { Visibility as VisibilityType } from "types"
import { VISIBILITY_DATA } from "./SetVisibility"

type Props = { entityVisibility: VisibilityType; showTagLabel?: boolean } & TagProps

const Visibility = ({ entityVisibility, showTagLabel, ...tagProps }: Props) => {
  const VisibilityIcon = VISIBILITY_DATA[entityVisibility].Icon

  if (entityVisibility === VisibilityType.PUBLIC) return null

  return (
    <Tooltip
      label={`${VISIBILITY_DATA[entityVisibility].title}: ${VISIBILITY_DATA[entityVisibility].description}`}
    >
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
