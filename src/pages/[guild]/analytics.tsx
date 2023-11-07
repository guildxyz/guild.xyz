import NoPermissionToPageFallback from "components/[guild]/NoPermissionToPageFallback"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import MembersCountChart from "components/analytics/MembersChart"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import Head from "next/head"
import { useRouter } from "next/router"
import ErrorPage from "pages/_error"

const GuildPage = (): JSX.Element => {
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const { name, imageUrl } = useGuild()

  return (
    <>
      <Head>
        <meta name="theme-color" content={localThemeColor} />
      </Head>

      <Layout
        title={name}
        ogTitle={`Analytics - ${name}`}
        textColor={textColor}
        image={
          <GuildLogo
            imageUrl={imageUrl}
            size={{ base: "56px", lg: "72px" }}
            mt={{ base: 1, lg: 2 }}
            bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
          />
        }
        imageUrl={imageUrl}
        background={localThemeColor}
        backgroundImage={localBackgroundImage}
      >
        <GuildTabs activeTab="ANALYTICS" />
        <NoPermissionToPageFallback>
          <MembersCountChart />
        </NoPermissionToPageFallback>
      </Layout>
    </>
  )
}

const GuildPageWrapper = (): JSX.Element => {
  const { name, error } = useGuild()
  const router = useRouter()

  if (error) return <ErrorPage statusCode={404} />

  return (
    <>
      <Head>
        <title>{`${name} analytics`}</title>
        <meta property="og:title" content={`${name} analytics`} />
      </Head>
      <ThemeProvider>{router.isReady && <GuildPage />}</ThemeProvider>
    </>
  )
}

export default GuildPageWrapper
