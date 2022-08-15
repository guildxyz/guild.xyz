import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  GridItem,
  HStack,
  SimpleGrid,
  Skeleton,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import RepoCard from "components/create-guild/github/RepoCard"
import SearchBar from "components/explorer/SearchBar"
import useGateables from "hooks/useGateables"
import Link from "next/link"
import { ArrowSquareOut } from "phosphor-react"
import { useState } from "react"

const GitHubGuildSetup = ({
  onSelection,
}: {
  onSelection?: (platformGuildId: string) => void
}) => {
  const { gateables, isLoading, error } = useGateables("GITHUB")
  const [search, setSearch] = useState<string>("")
  const filteredRepos = gateables?.filter?.((repo) =>
    [repo.platformGuildId, repo.repositoryName, repo.description].some((prop) =>
      prop?.toLowerCase()?.includes(search)
    )
  )

  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
        {[...Array(5)].map(() => {
          return (
            <GridItem>
              <Card padding={4}>
                <HStack justifyContent={"space-between"} w="full" h="full">
                  <Skeleton h={3} w={200} maxWidth={220} />
                  <Skeleton
                    h={10}
                    borderRadius="xl"
                    w={110}
                    maxWidth={220}
                    opacity={0.4}
                  />
                </HStack>
              </Card>
            </GridItem>
          )
        })}
      </SimpleGrid>
    )
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <VStack alignItems="start">
          <AlertTitle>GitHub error</AlertTitle>
          <AlertDescription>
            Failed to retrieve repositories, try disconnecting your GitHub account
          </AlertDescription>
        </VStack>
      </Alert>
    )
  }

  if (gateables?.length > 0) {
    return (
      <>
        <Box maxW="lg" mb={8}>
          <SearchBar placeholder="Search repo" {...{ search, setSearch }} />
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
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
