import { HStack, Tag, Text } from "@chakra-ui/react"
import { useMemo } from "react"
import { Group } from "temporaryData/types"
import CategorySection from "./CategorySection"
import GroupCard from "./GroupCard"

type Props = {
  orderedGroups: Group[]
  searchInput: string
}

const filterByName = (name: string, searchInput: string) =>
  name.toLowerCase().includes(searchInput.toLowerCase())

const GroupsList = ({ orderedGroups, searchInput }: Props): JSX.Element => {
  // TODO: userGuilds, filteredUsersGroups

  const filteredGroups = useMemo(
    () => orderedGroups.filter(({ name }) => filterByName(name, searchInput)),
    [orderedGroups, searchInput]
  )

  return (
    <>
      {/* TODO: show user's groups too */}
      <CategorySection
        title={
          <HStack spacing={2} alignItems="center">
            <Text as="span">All groups</Text>
            <Tag size="sm">{filteredGroups.length}</Tag>
          </HStack>
        }
        fallbackText={`No results for ${searchInput}`}
      >
        {filteredGroups.length &&
          filteredGroups.map((group) => (
            <GroupCard key={group.id} groupData={group} />
          ))}
      </CategorySection>
    </>
  )
}

export default GroupsList
