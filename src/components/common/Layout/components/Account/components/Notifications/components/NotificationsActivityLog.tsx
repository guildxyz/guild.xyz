import {
  Divider,
  HStack,
  Icon,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react"
import { ActivityLogActionProvider } from "components/[guild]/activity/ActivityLogAction/ActivityLogActionContext"
import ActionIcon from "components/[guild]/activity/ActivityLogAction/components/ActionIcon"
import ActionLabel from "components/[guild]/activity/ActivityLogAction/components/ActionLabel"
import { useActivityLog } from "components/[guild]/activity/ActivityLogContext"
import Button from "components/common/Button"
import Link from "next/link"
import { ArrowRight } from "phosphor-react"
import GhostIcon from "static/avatars/ghost.svg"

const SHOWN_ACTIONS_COUNT = 3

const NotificationsActivityLog = (): JSX.Element => {
  const { data, isValidating } = useActivityLog()

  return (
    <>
      <Stack minW="xs" spacing={0.5} divider={<Divider />}>
        {!data || isValidating ? (
          [...Array(SHOWN_ACTIONS_COUNT)].map((_, i) => (
            <HStack key={i} spacing={4} py={4}>
              <SkeletonCircle boxSize={8} />
              <Stack spacing={1}>
                <Skeleton h={5} w={36} />
                <Skeleton h={4} w={20} />
              </Stack>
            </HStack>
          ))
        ) : !data.entries.length ? (
          <HStack py="3" spacing="3.5">
            <Icon as={GhostIcon} boxSize={5} alt="Not found" />
            <Text>No actions yet</Text>
          </HStack>
        ) : (
          data.entries.slice(0, SHOWN_ACTIONS_COUNT)?.map((action) => (
            <ActivityLogActionProvider key={action.id} action={action}>
              <HStack spacing={4} py={4} pl="1">
                <ActionIcon size={6} />
                <Stack spacing={{ base: 1, md: 0.5 }}>
                  <ActionLabel />
                  <Text as="span" colorScheme="gray" fontSize="sm">
                    {new Date(Number(action.timestamp)).toLocaleString()}
                    {/* TODO: would be nice to display user friendly "Today at x" or "x days ago" relative times */}
                    {/* {`${formatRelativeTimeFromNow(
                      Date.now() - parseInt(action.timestamp)
                    )} ago`} */}
                  </Text>
                </Stack>
              </HStack>
            </ActivityLogActionProvider>
          ))
        )}
      </Stack>
      {data?.entries?.length > 0 && (
        <Button
          as={Link}
          href="/profile/activity"
          w="full"
          h="10"
          mt="2"
          rightIcon={<Icon as={ArrowRight} />}
        >
          View all
        </Button>
      )}
    </>
  )
}

export default NotificationsActivityLog
