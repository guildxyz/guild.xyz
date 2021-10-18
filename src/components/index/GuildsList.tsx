import { HStack, Tag, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import AddCard from "components/common/AddCard"
import CategorySection from "components/index/CategorySection"
import GuildCard from "components/index/GuildCard"
import { useMemo } from "react"
import { Guild } from "temporaryData/types"
import useUsersGroupsGuilds from "./hooks/useUsersGroupsGuilds"

type Props = {
  orderedGuilds: Guild[]
  searchInput: string
}

const filterByName = (name: string, searchInput: string) =>
  name.toLowerCase().includes(searchInput.toLowerCase())

const GuildsList = ({ orderedGuilds, searchInput }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const usersGroupsGuildsIds = useUsersGroupsGuilds()

  const usersGuilds = useMemo(
    () =>
      orderedGuilds.filter(
        ({ id, owner: { addresses } }) =>
          usersGroupsGuildsIds?.guilds?.includes(id) ||
          addresses.includes(account?.toLowerCase())
      ),
    [orderedGuilds, usersGroupsGuildsIds, account]
  )

  const filteredGuilds = useMemo(
    () => orderedGuilds.filter(({ name }) => filterByName(name, searchInput)),
    [orderedGuilds, searchInput]
  )

  const filteredUsersGuilds = useMemo(
    () => usersGuilds.filter(({ name }) => filterByName(name, searchInput)),
    [usersGuilds, searchInput]
  )

  return (
    <>
      <CategorySection
        title={
          usersGuilds.length ? "Your guilds" : "You're not part of any guilds yet"
        }
        fallbackText={`No results for ${searchInput}`}
      >
        {usersGuilds.length ? (
          filteredUsersGuilds.length &&
          filteredUsersGuilds
            .map((guild) => <GuildCard key={guild.id} guildData={guild} />)
            .concat(
              <AddCard key="create-guild" text="Create guild" link="/create-guild" />
            )
        ) : (
          <AddCard text="Create guild" link="/create-guild" />
        )}
      </CategorySection>
      <CategorySection
        title={
          <HStack spacing={2} alignItems="center">
            <Text as="span">All guilds</Text>
            <Tag size="sm">{filteredGuilds.length}</Tag>
          </HStack>
        }
        fallbackText={
          searchInput?.length > 0
            ? `No results for ${searchInput}`
            : "There aren't any guilds on Guildhall yet"
        }
      >
        {filteredGuilds.length &&
          filteredGuilds.map((guild) => (
            <GuildCard key={guild.id} guildData={guild} />
          ))}
      </CategorySection>
    </>
  )
}

export default GuildsList
