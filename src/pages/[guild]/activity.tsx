import { Stack } from "@chakra-ui/react"
import Card from "components/common/Card"
import ErrorAlert from "components/common/ErrorAlert"
import Layout from "components/common/Layout"
import { SectionTitle } from "components/common/Section"
import ActivityLogAction from "components/[guild]/activity/ActivityLogAction"
import {
  ActivityLogProvider,
  useActivityLog,
} from "components/[guild]/activity/ActivityLogContext"
import ActivityLogFiltersBar from "components/[guild]/activity/ActivityLogFiltersBar"
import ActivityLogSkeleton from "components/[guild]/activity/ActivityLogSkeleton"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useUser from "components/[guild]/hooks/useUser"
import Tabs from "components/[guild]/Tabs"
import TabButton from "components/[guild]/Tabs/components/TabButton"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"

const ActivityLog = (): JSX.Element => {
  const { name, urlName } = useGuild()
  const { id: userId } = useUser()
  const { isAdmin } = useGuildPermission()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const { data, isValidating } = useActivityLog()

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
        {isAdmin && (
          <TabButton href={`/${urlName}/activity`}>Activity log</TabButton>
        )}
      </Tabs>

      {userId && !isAdmin ? (
        <Card>
          <ErrorAlert
            label="You do not have permission to view this activity log"
            mb={0}
          />
        </Card>
      ) : (
        <>
          <ActivityLogFiltersBar />

          <SectionTitle title="Actions" mt={8} mb="4" />
          <Stack spacing={2.5}>
            {data?.entries?.length > 0 &&
              data.entries.map((action) => (
                <ActivityLogAction key={action.id} action={action} />
              ))}
            {isValidating && <ActivityLogSkeleton />}
          </Stack>
        </>
      )}
    </Layout>
  )
}

const ActivityLogWrapper = (): JSX.Element => {
  const { id } = useGuild()

  return (
    <ThemeProvider>
      <ActivityLogProvider guildId={id}>
        <ActivityLog />
      </ActivityLogProvider>
    </ThemeProvider>
  )
}

export default ActivityLogWrapper
