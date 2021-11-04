import {
  Box,
  GridItem,
  HStack,
  SimpleGrid,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react"
import Section from "components/common/Section"
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

type Props = {
  shouldHaveMaxHeight?: boolean
}

const GuildPicker = ({ shouldHaveMaxHeight = false }: Props) => {
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
    <Section
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
    >
      <SimpleGrid
        templateColumns={{ base: "auto 50px", md: "1fr 1fr 1fr" }}
        gap={{ base: 2, md: "6" }}
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <SearchBar placeholder="Search guilds" setSearchInput={setSearchInput} />
        </GridItem>
        <OrderSelect data={guilds} setOrderedData={setOrderedGuilds} />
      </SimpleGrid>
      <Box
        position="relative"
        mx={-4}
        minW="0"
        sx={{
          "-webkit-mask-image":
            "linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 20px), transparent)",
        }}
      >
        <CategorySection
          title=""
          fallbackText={`No results for ${searchInput}`}
          maxHeight={shouldHaveMaxHeight && "500px"}
          overflow="auto"
          className="custom-scrollbar"
          mt="0 !important"
          pb="6"
        >
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
      </Box>
    </Section>
  )
}

export default GuildPicker
