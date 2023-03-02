import { Tag, TagLabel, TagLeftIcon, TagProps, Tooltip } from "@chakra-ui/react"
import { Visibility as VisibilityType } from "types"
import { visibilityData } from "./SetVisibility"

type Props = { entityVisibility: VisibilityType; showTagLabel?: boolean } & TagProps

const Visibility = ({ entityVisibility, showTagLabel, ...tagProps }: Props) => {
  const VisibilityIcon = visibilityData[entityVisibility].Icon

  if (entityVisibility === VisibilityType.PUBLIC) return null

  return (
    <Tooltip
      label={`${visibilityData[entityVisibility].title}: ${visibilityData[entityVisibility].description}`}
    >
      <Tag bg={showTagLabel ? undefined : "unset"} ml={1} color="gray" {...tagProps}>
        <TagLeftIcon as={VisibilityIcon} boxSize={"16px"} />
        {showTagLabel && (
          <TagLabel>{visibilityData[entityVisibility].title}</TagLabel>
        )}
      </Tag>
    </Tooltip>
  )
}

export default Visibility
