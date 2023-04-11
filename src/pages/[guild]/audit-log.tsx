import Layout from "components/common/Layout"
import Section from "components/common/Section"
import AuditLogAction from "components/[guild]/audit-log/AuditLogAction"
import AuditLogFiltersBar from "components/[guild]/audit-log/AuditLogFiltersBar"
import AuditLogSkeleton from "components/[guild]/audit-log/AuditLogSkeleton"
import useAuditLog from "components/[guild]/audit-log/hooks/useAuditLog"
import useGuild from "components/[guild]/hooks/useGuild"
import Tabs from "components/[guild]/Tabs/Tabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useScrollEffect from "hooks/useScrollEffect"
import { useRef } from "react"

const AuditLog = (): JSX.Element => {
  const { name } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  // TODO: redirect if user is not an admin of the guild

  const { data, size, setSize, isValidating } = useAuditLog()

  const listRef = useRef(null)
  useScrollEffect(() => {
    if (
      isValidating ||
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
    )
      return

    setSize(size + 1)
  }, [isValidating])

  return (
    <Layout
      title={name}
      ogTitle={`Audig Log - ${name}`}
      textColor={textColor}
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
    >
      <Tabs />
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
