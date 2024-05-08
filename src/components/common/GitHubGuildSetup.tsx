import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  GridItem,
  Link,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import RepoCard, { RepoSkeletonCard } from "components/create-guild/github/RepoCard"
import SearchBar from "components/explorer/SearchBar"
import useGateables from "hooks/useGateables"
import useSubmit from "hooks/useSubmit"
import { useState } from "react"
import { PlatformType } from "types"
import Button from "./Button"
import ReconnectAlert from "./ReconnectAlert"

const GitHubGuildSetup = ({
  onSelection,
}: {
  onSelection?: (platformGuildId: string) => void
}) => {
  const { gateables, isLoading, error, mutate } = useGateables(PlatformType.GITHUB)

  /**
   * To have a clean loading state between a reauth and a gatealbes list, it is
   * needed to know the state of that specific mutation. If we used the gateables
   * SWR's isValidating, we would have skeletons on refocus
   */
  const mutateGateables = useSubmit(() => mutate())

  const [search, setSearch] = useState<string>("")
  const filteredRepos = gateables?.filter?.((repo) =>
    [repo.platformGuildId, repo.repositoryName, repo.description].some((prop) =>
      prop?.toLowerCase()?.includes(search)
    )
  )

  const { onConnect, isLoading: isConnecting } = useConnectPlatform(
    "GITHUB",
    () => mutateGateables.onSubmit(),
    null,
    "creation"
  )

  if (isLoading || mutateGateables.isLoading) {
    return (
      <>
        <Box maxW="lg" mb={8}>
          <SearchBar placeholder="Search repo" {...{ search, setSearch }} />
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 5 }}>
          {[...Array(9)].map((_, i) => (
            <GridItem key={i}>
              <RepoSkeletonCard />
            </GridItem>
          ))}
        </SimpleGrid>
      </>
    )
  }

  if (error) {
    return <ReconnectAlert platformName="GITHUB" />
  }

  if (gateables?.length > 0) {
    return (
      <>
        <Box maxW="lg" mb={8}>
          <SearchBar placeholder="Search repo" {...{ search, setSearch }} />
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 5 }}>
          {(filteredRepos ?? gateables)?.map?.((repo) => (
            <RepoCard
              key={repo.platformGuildId}
              {...repo}
              onSelection={onSelection}
            />
          ))}
        </SimpleGrid>
      </>
    )
  }

  return (
    <Alert status="error">
      <AlertIcon />
      <VStack alignItems={"start"}>
        <AlertTitle>No repositories</AlertTitle>
        <AlertDescription>
          We couldn't find your repos, please{" "}
          <Button
            variant="link"
            onClick={onConnect}
            isLoading={isConnecting}
            loadingText={"authenticating"}
            spinnerPlacement="end"
          >
            reauthenticate
          </Button>
          , or if you don't have a repo yet, you can{" "}
          <Button as={Link} href="https://github.com/new" isExternal variant="link">
            create one
          </Button>
          , then return here to gate access to it!
        </AlertDescription>
      </VStack>
    </Alert>
  )
}

export default GitHubGuildSetup
