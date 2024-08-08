import {
  Box,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import { ThemeProvider } from "components/[guild]/ThemeContext"
import ActivityLogAction from "components/[guild]/activity/ActivityLogAction"
import {
  ActivityLogProvider,
  useActivityLog,
} from "components/[guild]/activity/ActivityLogContext"
import { ActivityLogFiltersProvider } from "components/[guild]/activity/ActivityLogFiltersBar/components/ActivityLogFiltersContext"
import FiltersInput from "components/[guild]/activity/ActivityLogFiltersBar/components/FiltersInput"
import ActivityLogSkeletons from "components/[guild]/activity/ActivityLogSkeleton"
import useUser from "components/[guild]/hooks/useUser"
import ErrorAlert from "components/common/ErrorAlert"
import Layout from "components/common/Layout"
import StickyBar from "components/common/Layout/StickyBar"
import { BackToExplorerButton } from "components/common/Layout/components/BackToExplorerButton"
import { SectionTitle } from "components/common/Section"
import ErrorPage from "pages/_error"

const ActivityLog = (): JSX.Element => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a") // dark color is from whiteAlpha.200, but without opacity so it can overlay the banner image
  const bgOpacity = useColorModeValue(0.06, 0.1)
  const bgLinearPercentage = useBreakpointValue({ base: "50%", sm: "55%" })

  const { data, isValidating, isLoading, error } = useActivityLog()

  return (
    <Layout
      title="Activity log"
      background={bgColor}
      backgroundProps={{
        opacity: 1,
        _before: {
          content: '""',
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          bg: `linear-gradient(to top right, ${bgColor} ${bgLinearPercentage}, transparent), url('/banner.svg ')`,
          bgSize: { base: "auto 100%", sm: "auto 115%" },
          bgRepeat: "no-repeat",
          bgPosition: "top 10px right 0px",
          opacity: bgOpacity,
        },
      }}
      textColor="white"
      backgroundOffset={46}
      backButton={<BackToExplorerButton />}
    >
      <ActivityLogFiltersProvider>
        <StickyBar>
          <FiltersInput />
        </StickyBar>

        <SectionTitle title="Actions" mt={8} mb="4" />
        <Stack spacing={2.5}>
          {isLoading ? (
            <ActivityLogSkeletons />
          ) : error ? (
            <ErrorAlert
              label={typeof error === "string" ? error : "Couldn't load actions"}
              mb={0}
            />
          ) : data && !data?.entries?.length ? (
            <Box p="8" borderWidth="2px" borderRadius={"2xl"} borderStyle={"dashed"}>
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
    </Layout>
  )
}

const ActivityLogWrapper = (): JSX.Element => {
  const { id, isSuperAdmin } = useUser()

  if (id && !isSuperAdmin) return <ErrorPage statusCode={404} />

  return (
    <ThemeProvider>
      <ActivityLogProvider>
        <ActivityLog />
      </ActivityLogProvider>
    </ThemeProvider>
  )
}

export default ActivityLogWrapper
