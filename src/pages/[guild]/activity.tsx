import Layout from "components/common/Layout"
import Section from "components/common/Section"
import ActivityLogAction from "components/[guild]/activity/ActivityLogAction"
import ActivityLogFiltersBar from "components/[guild]/activity/ActivityLogFiltersBar"
import ActivityLogSkeleton from "components/[guild]/activity/ActivityLogSkeleton"
import useActivityLog from "components/[guild]/activity/hooks/useActivityLog"
import useGuild from "components/[guild]/hooks/useGuild"
import TabButton from "components/[guild]/Tabs/components/TabButton"
import Tabs from "components/[guild]/Tabs/Tabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useScrollEffect from "hooks/useScrollEffect"
import { useRef } from "react"

const SCROLL_PADDING = 40

const ActivityLog = (): JSX.Element => {
  const { name, urlName } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  // TODO: redirect if user is not an admin of the guild

  const { data, setSize, isValidating } = useActivityLog()

  const listRef = useRef(null)
  useScrollEffect(() => {
    if (
      isValidating ||
      window.innerHeight + document.documentElement.scrollTop <
        document.documentElement.offsetHeight - SCROLL_PADDING
    )
      return

    setSize((prevSize) => prevSize + 1)
  }, [isValidating])

  return (
    <Layout
      title={name}
      ogTitle={`Activity${name ? ` - ${name}` : ""}`}
      textColor={textColor}
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
    >
      <Tabs>
        <TabButton href={`/${urlName}`}>Home</TabButton>
        <TabButton href={`/${urlName}/activity`}>Activity log</TabButton>
      </Tabs>

      <ActivityLogFiltersBar />

      <Section ref={listRef} title="Actions" mt={8}>
        {data?.entries?.length > 0 &&
          data.entries.map((action) => (
            <ActivityLogAction key={action.id} action={action} />
          ))}

        {isValidating && <ActivityLogSkeleton />}
      </Section>
    </Layout>
  )
}

const ActivityLogWrapper = (): JSX.Element => (
  <ThemeProvider>
    <ActivityLog />
  </ThemeProvider>
)

export default ActivityLogWrapper
