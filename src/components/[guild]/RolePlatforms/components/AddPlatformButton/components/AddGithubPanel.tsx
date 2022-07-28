import { GridItem, SimpleGrid, Spinner } from "@chakra-ui/react"
import RepoCard from "components/create-guild/github/RepoCard"
import { useSubmitWithSign } from "hooks/useSubmit"
import { useEffect } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import fetcher from "utils/fetcher"

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
    <FormProvider {...methods}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
        {response ? (
          response.map((repo) => (
            <GridItem key={repo.platformGuildId}>
              <RepoCard
                {...repo}
                onSelection={(platformGuildId) => {
                  append({
                    guildPlatform: {
                      platformName: "GITHUB",
                      platformGuildId: encodeURIComponent(platformGuildId),
                    },
                  })
                  onClose()
                }}
              />
            </GridItem>
          ))
        ) : (
          <Spinner />
        )}
      </SimpleGrid>
    </FormProvider>
  )
}

export default AddGithubPanel
