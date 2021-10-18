import { HStack, Tag, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import { useMemo } from "react"
import { Group } from "temporaryData/types"
import CategorySection from "./CategorySection"
import GroupCard from "./GroupCard"
import useUsersGroupsGuilds from "./hooks/useUsersGroupsGuilds"

type Props = {
  orderedGroups: Array<Group>
  searchInput: string
}

const filterByName = (name: string, searchInput: string) =>
  name.toLowerCase().includes(searchInput.toLowerCase())

const GroupsList = ({ orderedGroups, searchInput }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const usersGroupsGuildsIds = useUsersGroupsGuilds()

  const usersGroups = useMemo(
    () =>
      orderedGroups.filter(
        ({ id, owner: { addresses } }) =>
          usersGroupsGuildsIds?.groups?.includes(id) ||
          addresses.includes(account?.toLowerCase())
      ),
    [orderedGroups, usersGroupsGuildsIds, account]
  )

  const filteredGroups = useMemo(
    () => orderedGroups.filter(({ name }) => filterByName(name, searchInput)),
    [orderedGroups, searchInput]
  )

  const filteredUsersGroups = useMemo(
    () => usersGroups.filter(({ name }) => filterByName(name, searchInput)),
    [usersGroups, searchInput]
  )

  return (
    <>
      <CategorySection
        title={
          usersGroups.length ? "Your groups" : "You're not part of any groups yet"
        }
        fallbackText={`No results for ${searchInput}`}
      >
        {usersGroups.length ? (
          filteredUsersGroups.length &&
          filteredUsersGroups
            .map((group) => <GroupCard key={group.id} groupData={group} />)
            .concat(
              <AddCard key="create-group" text="Create group" link="/create-group" />
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
        fallbackText={
          searchInput?.length > 0
            ? `No results for ${searchInput}`
            : "There aren't any groups on Guildhall yet"
        }
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
