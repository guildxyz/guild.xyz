import { Tag, TagLabel, TagLeftIcon, Tooltip, Wrap } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import { Users } from "phosphor-react"
import { PropsWithChildren } from "react"
import { Guild } from "temporaryData/types"
import { Rest } from "types"
import useRequirementLabels from "../../../hooks/useRequirementLabels"

type Props = {
  guildData: Guild
} & Rest

const GuildCard = ({
  guildData,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const requirementLabels = useRequirementLabels(guildData.requirements)

  return (
    <DisplayCard image={guildData.imageUrl} title={guildData.name} {...rest}>
      <>
        <Wrap zIndex="1">
          <Tag as="li">
            <TagLeftIcon as={Users} />
            <TagLabel>{guildData.members?.length || 0}</TagLabel>
          </Tag>
          <Tooltip label={requirementLabels}>
            <Tag as="li">
              <TagLabel>
                {(() => {
                  const reqCount = guildData.requirements?.length || 0
                  return `${reqCount} requirement${reqCount > 1 ? "s" : ""}`
                })()}
              </TagLabel>
            </Tag>
          </Tooltip>
        </Wrap>
        {children}
      </>
    </DisplayCard>
  )
}

export default GuildCard
