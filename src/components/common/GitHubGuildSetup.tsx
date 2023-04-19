import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  GridItem,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import RepoCard, { RepoSkeletonCard } from "components/create-guild/github/RepoCard"
import SearchBar from "components/explorer/SearchBar"
import useGateables from "hooks/useGateables"
import Link from "next/link"
import { ArrowSquareOut } from "phosphor-react"
import { useState } from "react"
import { PlatformType } from "types"
import Button from "./Button"
import ReconnectAlert from "./ReconnectAlert"

const GitHubGuildSetup = ({
  onSelection,
}: {
  onSelection?: (platformGuildId: string) => void
}) => {
  const { gateables, isLoading, error } = useGateables(PlatformType.GITHUB, {
    refreshInterval: 10_000,
  })
  const [search, setSearch] = useState<string>("")
  const filteredRepos = gateables?.filter?.((repo) =>
    [repo.platformGuildId, repo.repositoryName, repo.description].some((prop) =>
      prop?.toLowerCase()?.includes(search)
    )
  )

  if (isLoading) {
    return (
      <>
        <Box maxW="lg" mb={8}>
          <SearchBar placeholder="Search repo" {...{ search, setSearch }} />
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 5 }}>
          {[...Array(9)].map((i) => (
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
            <CardMotionWrapper key={repo.platformGuildId}>
              <GridItem>
                <RepoCard {...repo} onSelection={onSelection} />
              </GridItem>
            </CardMotionWrapper>
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
          It looks like you don't have any repositories yet. Create one and return
          here to gate access to it!
        </AlertDescription>
        <Link passHref href="https://github.com/new">
          <Button as="a" target={"_blank"} size="sm" rightIcon={<ArrowSquareOut />}>
            Create a repository
          </Button>
        </Link>
      </VStack>
    </Alert>
  )
}

export default GitHubGuildSetup
