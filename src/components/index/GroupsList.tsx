import { HStack, Tag, Text } from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import { useMemo } from "react"
import { Group } from "temporaryData/types"
import CategorySection from "./CategorySection"
import GroupCard from "./GroupCard"

type Props = {
  orderedGroups: Array<Group>
  searchInput: string
}

const filterByName = (name: string, searchInput: string) =>
  name.toLowerCase().includes(searchInput.toLowerCase())

const GroupsList = ({ orderedGroups, searchInput }: Props): JSX.Element => {
  // TODO: usersGroups, filteredUsersGroups

  // TEMP
  const usersGroups: Array<Group> = []
  const filteredUsersGroups: Array<Group> = []

  const filteredGroups = useMemo(
    () => orderedGroups.filter(({ name }) => filterByName(name, searchInput)),
    [orderedGroups, searchInput]
  )

  return (
    <>
      {/* TODO: show user's groups too */}
      <CategorySection
        title="You're not part of any guilds yet"
        fallbackText={`No results for ${searchInput}`}
      >
        {usersGroups.length ? (
          filteredUsersGroups.length &&
          filteredUsersGroups
            .map((group) => <GroupCard key={group.id} groupData={group} />)
            .concat(
              <AddCard key="create-guild" text="Create guild" link="/create-guild" />
            )
        ) : (
          <AddCard text="Create group" link="/create-group" />
        )}
      </CategorySection>
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
