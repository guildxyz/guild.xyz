import { Box, Spinner, Stack, Text } from "@chakra-ui/react"
import NoPermissionToPageFallback from "components/[guild]/NoPermissionToPageFallback"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import ActivityLogAction from "components/[guild]/activity/ActivityLogAction"
import {
  ActivityLogProvider,
  useActivityLog,
} from "components/[guild]/activity/ActivityLogContext"
import GuildActivityLogFiltersBar from "components/[guild]/activity/ActivityLogFiltersBar/GuildActivityLogFiltersBar"
import { ActivityLogFiltersProvider } from "components/[guild]/activity/ActivityLogFiltersBar/components/ActivityLogFiltersContext"
import ActivityLogSkeletons from "components/[guild]/activity/ActivityLogSkeleton"
import useGuild from "components/[guild]/hooks/useGuild"
import ErrorAlert from "components/common/ErrorAlert"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import { BackButton } from "components/common/Layout/components/BackButton"
import { SectionTitle } from "components/common/Section"

const ActivityLog = (): JSX.Element => {
  const { name, imageUrl } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const { data, isValidating, isLoading, error } = useActivityLog()

  return (
    <Layout
      title={name}
      ogTitle={`Activity${name ? ` - ${name}` : ""}`}
      image={
        <GuildLogo
          imageUrl={imageUrl}
          size={{ base: "56px", lg: "72px" }}
          mt={{ base: 1, lg: 2 }}
          bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
        />
      }
      imageUrl={imageUrl}
      textColor={textColor}
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
      backButton={<BackButton />}
    >
      <GuildTabs activeTab="ACTIVITY" isSticky={false} />

      <NoPermissionToPageFallback>
        <ActivityLogFiltersProvider>
          <GuildActivityLogFiltersBar />
          <SectionTitle
            title="Actions"
            mt={8}
            mb="4"
            titleRightElement={isLoading && <Spinner size="xs" mt="4" />}
          />
          <Stack spacing={2.5}>
            {isLoading ? (
              <ActivityLogSkeletons />
            ) : error ? (
              <ErrorAlert
                label={typeof error === "string" ? error : "Couldn't load actions"}
                mb={0}
              />
            ) : data && !data?.entries?.length ? (
              <Box
                p="8"
                borderWidth="2px"
                borderRadius={"2xl"}
                borderStyle={"dashed"}
              >
                <Text colorScheme="gray">
                  No actions found for the filters you've set
                </Text>
              </Box>
            ) : (
              data?.entries?.map((action) => (
                <ActivityLogAction key={action.id} action={action} />
              ))
            )}
            {!isLoading && isValidating && <ActivityLogSkeletons />}
          </Stack>
        </ActivityLogFiltersProvider>
      </NoPermissionToPageFallback>
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
