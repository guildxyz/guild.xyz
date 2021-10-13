import { Alert, AlertDescription, AlertIcon, Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Layout from "components/common/Layout"
import SelectableGuildCard from "components/create-group/SelectableGuildCard"
import CategorySection from "components/index/CategorySection"
import OrderSelect from "components/index/OrderSelect"
import SearchBar from "components/index/SearchBar"
import fetchGuilds from "components/index/utils/fetchGuilds"
import { GetServerSideProps } from "next"
import React, { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import useSWR from "swr"
import { Guild } from "temporaryData/types"

type Props = {
  guilds: Guild[]
}

const filterByName = (name: string, searchInput: string) =>
  name.toLowerCase().includes(searchInput.toLowerCase())

const CreateGroupPage = ({ guilds: guildsInitial }: Props): JSX.Element => {
  const { data: guilds } = useSWR("guilds", fetchGuilds, {
    fallbackData: guildsInitial,
  })
  const { account } = useWeb3React()
  const methods = useForm({ mode: "all" })

  const [searchInput, setSearchInput] = useState("")
  const [orderedGuilds, setOrderedGuilds] = useState(guilds)

  const filteredGuilds = useMemo(
    () => orderedGuilds.filter(({ name }) => filterByName(name, searchInput)),
    [orderedGuilds, searchInput]
  )

  const [checkedGuilds, setCheckedGuilds] = useState([])

  const onGuildCheck = (guildId: number, action: "add" | "remove") => {
    setCheckedGuilds(
      action === "add"
        ? [...checkedGuilds, guildId]
        : checkedGuilds.filter((id) => id !== guildId)
    )
  }

  // DEBUG
  useEffect(() => {
    console.log(checkedGuilds)
  }, [checkedGuilds])

  return (
    <FormProvider {...methods}>
      <Layout title="Create Group">
        {account ? (
          <>
            <Stack direction="row" spacing={{ base: 2, md: "6" }} mb={16}>
              <SearchBar
                placeholder="Search guilds"
                setSearchInput={setSearchInput}
              />
              <OrderSelect {...{ guilds, setOrderedGuilds }} />
            </Stack>

            <Stack spacing={12}>
              <CategorySection
                title="Select guilds"
                fallbackText={`No results for ${searchInput}`}
              >
                {filteredGuilds.length &&
                  filteredGuilds.map((guild) => (
                    <SelectableGuildCard
                      key={guild.id}
                      guildData={guild}
                      defaultChecked={checkedGuilds.includes(guild.id)}
                      onChange={onGuildCheck}
                    />
                  ))}
              </CategorySection>
            </Stack>
          </>
        ) : (
          <Alert status="error" mb="6">
            <AlertIcon />
            <Stack>
              <AlertDescription position="relative" top={1}>
                Please connect your wallet in order to continue!
              </AlertDescription>
            </Stack>
          </Alert>
        )}
      </Layout>
    </FormProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const guilds = await fetchGuilds()

  return {
    props: { guilds },
  }
}

export default CreateGroupPage
