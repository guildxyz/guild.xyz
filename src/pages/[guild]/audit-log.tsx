import Layout from "components/common/Layout"
import Section from "components/common/Section"
import AuditLogAction from "components/[guild]/audit-log/AuditLogAction"
import AuditLogFiltersBar from "components/[guild]/audit-log/AuditLogFiltersBar"
import AuditLogSkeleton from "components/[guild]/audit-log/AuditLogSkeleton"
import useAuditLog from "components/[guild]/audit-log/hooks/useAuditLog"
import useGuild from "components/[guild]/hooks/useGuild"
import TabButton from "components/[guild]/Tabs/components/TabButton"
import Tabs from "components/[guild]/Tabs/Tabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useScrollEffect from "hooks/useScrollEffect"
import { useRef } from "react"

const SCROLL_PADDING = 40

const AuditLog = (): JSX.Element => {
  const { name, urlName } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  // TODO: redirect if user is not an admin of the guild

  const { data, setSize, isValidating } = useAuditLog()

  const listRef = useRef(null)
  useScrollEffect(() => {
    if (
      isValidating ||
      window.innerHeight + document.documentElement.scrollTop <
        document.documentElement.offsetHeight - SCROLL_PADDING
    )
      return

    console.log("setting size")

    setSize((prevSize) => prevSize + 1)
  }, [isValidating])

  return (
    <Layout
      title={name}
      ogTitle={`Audig Log - ${name}`}
      textColor={textColor}
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
    >
      <Tabs>
        <TabButton href={`/${urlName}`}>Home</TabButton>
        <TabButton href={`/${urlName}/audit-log`}>Audit log</TabButton>
      </Tabs>

      <AuditLogFiltersBar />

      <Section ref={listRef} title="Actions" mt={8}>
        {data?.entries?.length > 0 &&
          data.entries.map((action) => (
            <AuditLogAction key={action.id} action={action} />
          ))}

        {isValidating && <AuditLogSkeleton />}
      </Section>
    </Layout>
  )
}

const AuditLogWrapper = (): JSX.Element => (
  <ThemeProvider>
    <AuditLog />
  </ThemeProvider>
)

export default AuditLogWrapper
