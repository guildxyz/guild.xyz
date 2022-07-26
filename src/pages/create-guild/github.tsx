import { GridItem, SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import RepoCard from "components/create-guild/github/RepoCard"
import useUser from "components/[guild]/hooks/useUser"
import { useSubmitWithSign } from "hooks/useSubmit"
import { useRouter } from "next/router"
import { useEffect } from "react"
import fetcher from "utils/fetcher"

const CreateGithubGuild = () => {
  const { platformUsers } = useUser()
  const isGithubConnected = platformUsers?.some(
    ({ platformName }) => platformName === "GITHUB"
  )
  const router = useRouter()

  useEffect(() => {
    if (platformUsers !== undefined && isGithubConnected === false) {
      router.push("/create-guild")
    }
  }, [platformUsers, isGithubConnected])

  /**
   * TODO: Once signing keypair is merged, use SWR with fetcherWithSign here instead
   * of useSubmitWitkSign & useEffect
   */
  const { onSubmit, response, isLoading, isSigning, error } = useSubmitWithSign(
    ({ data, validation }) =>
      fetcher("/guild/listGateables", {
        method: "POST",
        body: { payload: data, ...validation },
      })
  )
  useEffect(() => {
    if (!response) onSubmit({ platformName: "GITHUB" })
  }, [response])

  return (
    <Layout title="Create Guild on GitHub">
      {isLoading || isSigning ? (
        <Spinner />
      ) : error ? (
        <Text>
          Failed to retrieve repositories, try disconnecting your GitHub account
        </Text>
      ) : response ? (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
          {response.map((repo) => (
            <GridItem key={repo.platformGuildId}>
              <RepoCard {...repo} />
            </GridItem>
          ))}
        </SimpleGrid>
      ) : null}
    </Layout>
  )
}

export default CreateGithubGuild
