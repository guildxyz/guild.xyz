import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  GridItem,
  SimpleGrid,
  Spinner,
  VStack,
} from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import RepoCard from "components/create-guild/github/RepoCard"
import SearchBar from "components/explorer/SearchBar"
import useGateables from "hooks/useGateables"
import Link from "next/link"
import { ArrowSquareOut } from "phosphor-react"
import { useState } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"

type Props = {
  onClose: () => void
}

const defaultValues = {
  platformGuildId: null,
}

const AddGithubPanel = ({ onClose }: Props) => {
  const methods = useForm({ mode: "all", defaultValues })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  // const platformGuildId = useWatch({
  //   control: methods.control,
  //   name: `platformGuildId`,
  // })

  const { gateables, isLoading, error } = useGateables("GITHUB")

  const [search, setSearch] = useState<string>("")

  const filteredRepos = gateables?.filter?.((repo) =>
    [repo.platformGuildId, repo.repositoryName, repo.description].some((prop) =>
      prop?.toLowerCase()?.includes(search)
    )
  )

  return (
    <FormProvider {...methods}>
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

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
            {(filteredRepos ?? gateables)?.map?.((repo) => (
              <CardMotionWrapper key={repo.platformGuildId}>
                <GridItem>
                  <RepoCard
                    {...repo}
                    onSelection={(platformGuildId) => {
                      append({
                        guildPlatform: {
                          platformName: "GITHUB",
                          platformGuildId: encodeURIComponent(platformGuildId),
                          isNew: true,
                        },
                      })
                      onClose()
                    }}
                  />
                </GridItem>
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
    </FormProvider>
  )
}

export default AddGithubPanel
