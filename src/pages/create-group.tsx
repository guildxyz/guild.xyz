import {
  Alert,
  AlertDescription,
  AlertIcon,
  GridItem,
  HStack,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CtaButton from "components/common/CtaButton"
import Layout from "components/common/Layout"
import Section from "components/common/Section"
import SelectableGuildCard from "components/create-group/SelectableGuildCard"
import NameAndIcon from "components/create/NameAndIcon"
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
  const methods = useForm({ mode: "all" })
  const guildsInput = methods.register("guilds", {
    required: true,
    validate: (input) => input?.length > 0 || "You must pick at least one guild",
  })

  const { data: guilds } = useSWR("guilds", fetchGuilds, {
    fallbackData: guildsInitial,
  })
  const { account } = useWeb3React()

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

  useEffect(() => {
    methods.setValue("guilds", checkedGuilds)
  }, [checkedGuilds])

  return (
    <FormProvider {...methods}>
      <Layout
        title="Create Group"
        action={
          <CtaButton onClick={methods.handleSubmit(console.log, console.log)}>
            Submit
          </CtaButton>
        }
      >
        {account ? (
          <>
            <Stack spacing={12}>
              <Section title="Choose a logo and name for your Group">
                <NameAndIcon />
              </Section>
              <CategorySection
                title={
                  <HStack spacing={2} alignItems="center">
                    <Text as="span">Select guilds</Text>
                    {checkedGuilds?.length && (
                      <Tag size="sm">{checkedGuilds.length}</Tag>
                    )}
                  </HStack>
                }
                fallbackText={`No results for ${searchInput}`}
              >
                <GridItem colSpan={{ base: 1, md: 2, lg: 3 }}>
                  <Stack direction="row" spacing={{ base: 2, md: "6" }}>
                    <SearchBar
                      placeholder="Search guilds"
                      setSearchInput={setSearchInput}
                    />
                    <OrderSelect {...{ guilds, setOrderedGuilds }} />
                  </Stack>
                </GridItem>
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
