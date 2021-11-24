import { HStack, Tag, TagLabel, TagLeftIcon, Tooltip } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Link from "components/common/Link"
import { Users } from "phosphor-react"
import { PropsWithChildren } from "react"
import { Guild } from "temporaryData/types"
import { Rest } from "types"
import useRequirementLabels from "hooks/useRequirementLabels"

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
    <Link
      href={`/guild/${guildData.urlName}`}
      _hover={{ textDecor: "none" }}
      borderRadius="2xl"
      w="full"
    >
      <DisplayCard image={guildData.imageUrl} title={guildData.name} {...rest}>
        <>
          <HStack zIndex="1" spacing={1.5} maxW="full">
            <Tag as="li" minW="max-content">
              <TagLeftIcon as={Users} mr={1} />
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
          </HStack>
          {children}
        </>
      </DisplayCard>
    </Link>
  )
}

export default GuildCard
