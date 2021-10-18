import { GridItem, HStack, SimpleGrid, Stack, Tag, Text } from "@chakra-ui/react"
import CategorySection from "components/index/CategorySection"
import OrderSelect from "components/index/OrderSelect"
import SearchBar from "components/index/SearchBar"
import fetchGuilds from "components/index/utils/fetchGuilds"
import { useEffect, useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"
import useSWR from "swr"
import SelectableGuildCard from "./components/SelectableGuildCard"

const filterByName = (name: string, searchInput: string) =>
  name.toLowerCase().includes(searchInput.toLowerCase())

const GuildPicker = () => {
  const methods = useFormContext()

  useEffect(() => {
    methods.register("guilds", {
      validate: (input) => input?.length > 0 || "You must pick at least one guild!",
    })
  }, [])

  const { data: guilds } = useSWR("guilds", fetchGuilds)

  const [searchInput, setSearchInput] = useState("")
  const [orderedGuilds, setOrderedGuilds] = useState(guilds)

  const filteredGuilds = useMemo(
    () => orderedGuilds?.filter(({ name }) => filterByName(name, searchInput)),
    [orderedGuilds, searchInput]
  )

  const defaultCheckedGuilds = methods.getValues("guilds")
  const [checkedGuilds, setCheckedGuilds] = useState(defaultCheckedGuilds || [])

  const onGuildCheck = (guildId: number, action: "add" | "remove") => {
    setCheckedGuilds(
      action === "add" && !checkedGuilds?.includes(guildId)
        ? [...checkedGuilds, guildId]
        : checkedGuilds.filter((id) => id !== guildId)
    )
  }

  useEffect(() => {
    methods.setValue("guilds", checkedGuilds)
  }, [checkedGuilds])

  return (
    <CategorySection
      title={
        <Stack spacing={2}>
          <HStack spacing={2} alignItems="center">
            <Text as="span">Select guilds</Text>
            {checkedGuilds?.length && <Tag size="sm">{checkedGuilds.length}</Tag>}
          </HStack>
          {methods.formState.errors?.guilds && (
            <Text as="span" fontSize="sm" fontWeight="normal" color="red.300">
              {methods.formState.errors?.guilds?.message}
            </Text>
          )}
        </Stack>
      }
      fallbackText={`No results for ${searchInput}`}
    >
      <GridItem colSpan={{ base: 1, md: 2, lg: 3 }}>
        <SimpleGrid
          templateColumns={{ base: "auto 50px", md: "1fr 1fr 1fr" }}
          gap={{ base: 2, md: "6" }}
        >
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <SearchBar placeholder="Search guilds" setSearchInput={setSearchInput} />
          </GridItem>
          <OrderSelect {...{ guilds, setOrderedGuilds }} />
        </SimpleGrid>
      </GridItem>
      {filteredGuilds?.length &&
        filteredGuilds.map((guild) => (
          <SelectableGuildCard
            key={guild.id}
            guildData={guild}
            defaultChecked={checkedGuilds.includes(guild.id)}
            onChange={onGuildCheck}
          />
        ))}
    </CategorySection>
  )
}

export default GuildPicker
