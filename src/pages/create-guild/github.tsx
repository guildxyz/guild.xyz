import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  SimpleGrid,
  Spinner,
  VStack,
} from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import Layout from "components/common/Layout"
import RepoCard from "components/create-guild/github/RepoCard"
import SearchBar from "components/explorer/SearchBar"
import useUser from "components/[guild]/hooks/useUser"
import useGateables from "hooks/useGateables"
import Link from "next/link"
import { useRouter } from "next/router"
import { ArrowSquareOut } from "phosphor-react"
import { useEffect, useState } from "react"

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

  const { isLoading, error, gateables } = useGateables("GITHUB")

  const [search, setSearch] = useState<string>("")

  const filteredRepos = gateables?.filter?.((repo) =>
    [repo.platformGuildId, repo.repositoryName, repo.description].some((prop) =>
      prop?.toLowerCase()?.includes(search)
    )
  )

  return (
    <Layout title="Create Guild on GitHub">
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          <VStack alignItems="start">
            <AlertTitle>GitHub error</AlertTitle>
            <AlertDescription>
              Failed to retrieve repositories, try disconnecting your GitHub account
            </AlertDescription>
          </VStack>
        </Alert>
      ) : gateables?.length > 0 ? (
        <>
          <Box maxW="lg" mb={8}>
            <SearchBar placeholder="Search repo" {...{ search, setSearch }} />
          </Box>

          <SimpleGrid w="full" columns={{ base: 1, md: 2 }} gap={5}>
            {(filteredRepos ?? gateables)?.map?.((repo) => (
              <CardMotionWrapper key={repo.platformGuildId}>
                <RepoCard {...repo} />
              </CardMotionWrapper>
            ))}
          </SimpleGrid>
        </>
      ) : (
        <Alert status="error">
          <AlertIcon />
          <VStack alignItems={"start"}>
            <AlertTitle>No repositories</AlertTitle>
            <AlertDescription>
              It looks like you don't have any repositories yet. Create one and
              return here to gate access to it!
            </AlertDescription>
            <Link passHref href="https://github.com/new">
              <Button
                as="a"
                target={"_blank"}
                size="sm"
                rightIcon={<ArrowSquareOut />}
              >
                Create a repository
              </Button>
            </Link>
          </VStack>
        </Alert>
      )}
    </Layout>
  )
}

export default CreateGithubGuild
