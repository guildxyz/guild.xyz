import Layout from "components/common/Layout"
import AuditLogFiltersBar from "components/[guild]/audit-log/AuditLogFiltersBar"
import useGuild from "components/[guild]/hooks/useGuild"
import Tabs from "components/[guild]/Tabs/Tabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"

const AuditLog = (): JSX.Element => {
  const { name } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  return (
    <Layout
      title={name}
      ogTitle={`Audig Log - ${name}`}
      textColor={textColor}
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
      showBackButton
    >
      <Tabs />
      <AuditLogFiltersBar />
    </Layout>
  )
}

const AuditLogWrapper = (): JSX.Element => (
  <ThemeProvider>
    <AuditLog />
  </ThemeProvider>
)

export default AuditLogWrapper
