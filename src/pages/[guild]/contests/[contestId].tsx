import { Center, SimpleGrid, Spinner, VStack } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import ContestEntry from "components/[guild]/contests/components/ContestEntry"
import useContestEntries from "components/[guild]/contests/hooks/useContestEntries"
import useCreateEntry from "components/[guild]/contests/hooks/useCreateEntry"
import useGuildContest from "components/[guild]/contests/hooks/useGuildContest"
import useGuild from "components/[guild]/hooks/useGuild"
import { ThemeProvider } from "components/[guild]/ThemeContext"
import { Layout } from "components/common/Layout"
import PhotoUploader from "components/create-guild/IconSelector/components/PhotoUploader"
import usePinata from "hooks/usePinata"
import { useScrollBatchedRendering } from "hooks/useScrollBatchedRendering"
import { NextPage } from "next"
import { useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { z } from "zod"

const Page: NextPage = () => {
  const { name } = useGuild()
  const { data } = useGuildContest()
  const { entries, isValidating, setSize } = useContestEntries()

  const element = useScrollBatchedRendering({
    batchSize: 1,
    disableRendering: isValidating,
    setElementCount: setSize,
  })

  return (
    <Layout.Root>
      <Layout.Head ogTitle={`${data?.name ?? "Contest"} - ${name}`} />
      <Layout.HeaderSection>
        <Layout.Background />
        <Layout.Header />
        <Layout.Headline title={data?.name ?? "Contest"} />
      </Layout.HeaderSection>
      <Layout.MainSection>
        <VStack spacing={4}>
          <CreateEntryButton />
          <SimpleGrid ref={element} columns={2} gap={4} w="full">
            {entries?.map((entry) => (
              <ContestEntry key={entry.castHash} entry={entry} />
            ))}
          </SimpleGrid>
        </VStack>

        {!!entries?.length && <Center pt={6}>{isValidating && <Spinner />}</Center>}
      </Layout.MainSection>
    </Layout.Root>
  )
}

function CreateEntryButton() {
  const { onSubmit, isLoading } = useCreateEntry()

  const methods = useForm({
    resolver: zodResolver(
      z.object({
        img: z.string().min(1).url(),
      })
    ),
    mode: "all",
    defaultValues: {
      img: "",
    },
  })
  const { handleSubmit, control } = methods

  const img = useWatch({ control, name: "img" })

  useEffect(() => {
    if (!!img && img.length > 0) {
      handleSubmit((data) => {
        onSubmit({ img: data.img })
      })()
    }
    // Filling in all the dependencies results in infinite recursion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img])

  const imgUploader = usePinata({
    fieldToSetOnSuccess: "img",
    fieldToSetOnError: "img",
    control,
  })

  return (
    <FormProvider {...methods}>
      <PhotoUploader
        uploader={imgUploader}
        label=""
        showImgPreview={false}
        buttonLabel="Upload meme"
        buttonProps={{
          leftIcon: undefined,
          isLoading: imgUploader.isUploading || isLoading,
        }}
      />
    </FormProvider>
  )
}

const PageWrapper: NextPage = () => (
  <ThemeProvider>
    <Page />
  </ThemeProvider>
)

export default PageWrapper
