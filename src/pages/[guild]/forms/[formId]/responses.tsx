import { Spinner, Text } from "@chakra-ui/react"
import NoPermissionToPageFallback from "components/[guild]/NoPermissionToPageFallback"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import GuildImageAndName from "components/[guild]/collect/components/GuildImageAndName"
import FormResponsesTabs from "components/[guild]/forms/FormTabs"
import FormResponsesTable from "components/[guild]/forms/responses/FormResponsesTable"
import useGuild from "components/[guild]/hooks/useGuild"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import Card from "components/common/Card"
import ErrorAlert from "components/common/ErrorAlert"
import Layout from "components/common/Layout"
import Head from "next/head"
import { useRouter } from "next/router"
import ErrorPage from "pages/_error"

const FormResponses = (): JSX.Element => {
  const { imageUrl } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const router = useRouter()
  const formId = parseInt(router.query.formId as string)
  const { isLoading, form } = useGuildForm(formId)

  return (
    <>
      <Head>
        <meta name="theme-color" content={localThemeColor} />
      </Head>

      <Layout
        title={form?.name ?? "Form responses"}
        ogTitle={`Form responses${form?.name ? ` - ${form.name}` : ""}`}
        background={localThemeColor}
        backgroundImage={localBackgroundImage}
        backgroundOffset={112}
        backButton={<GuildImageAndName />}
        textColor={textColor}
        imageUrl={imageUrl}
        showFooter={false}
      >
        <FormResponsesTabs />
        <NoPermissionToPageFallback>
          {isLoading ? (
            <Card py="7" px="4" flexDirection="row" alignItems="center">
              <Spinner mr="3" boxSize="5" />
              <Text fontWeight="semibold">Loading form</Text>
            </Card>
          ) : !form ? (
            <Card>
              <ErrorAlert label="Form not found" mb="0" />
            </Card>
          ) : (
            <FormResponsesTable form={form} />
          )}
        </NoPermissionToPageFallback>
      </Layout>
    </>
  )
}

const FormResponsesPageWrapper = (): JSX.Element => {
  const { error } = useGuild()
  const router = useRouter()

  if (error) return <ErrorPage statusCode={404} />

  return (
    <>
      <Head>
        <title>Form responses</title>
        <meta property="og:title" content="Form responses" />
      </Head>
      <ThemeProvider>{router.isReady && <FormResponses />}</ThemeProvider>
    </>
  )
}

export default FormResponsesPageWrapper
