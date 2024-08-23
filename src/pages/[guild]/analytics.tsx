import NoPermissionToPageFallback from "components/[guild]/NoPermissionToPageFallback"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import MembersCountChart from "components/analytics/MembersChart"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import { BackButton } from "components/common/Layout/components/BackButton"
import Head from "next/head"
import { useRouter } from "next/router"
import ErrorPage from "pages/_error"

const AnalyticsPage = (): JSX.Element => {
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const { name, imageUrl } = useGuild()

  return (
    <>
      <Head>
        <meta name="theme-color" content={localThemeColor} />
      </Head>
      {/**
       * The visx tooltip has some overflow problems (it's most apparent on mobile where
       * the whole site jumpshifts around, but also visible on desktop as a horizontal
       * scrollbar), these styles prevent it
       */}
      <style>{`html, body {overflow-x: hidden}`}</style>

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
        backButton={<BackButton />}
      >
        {/* we can't use sticky tabs because of the hidden overflow on body */}
        <GuildTabs activeTab="ANALYTICS" isSticky={false} />
        <NoPermissionToPageFallback>
          <MembersCountChart />
        </NoPermissionToPageFallback>
      </Layout>
    </>
  )
}

const AnalyticsPageWrapper = (): JSX.Element => {
  const { error } = useGuild()
  const router = useRouter()

  if (error) return <ErrorPage statusCode={404} />

  return (
    <>
      <Head>
        <title>Analytics</title>
        <meta property="og:title" content="Analytics" />
      </Head>
      <ThemeProvider>{router.isReady && <AnalyticsPage />}</ThemeProvider>
    </>
  )
}

export default AnalyticsPageWrapper
