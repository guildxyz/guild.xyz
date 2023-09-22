import {
  Divider,
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react"
import { ActivityLogActionProvider } from "components/[guild]/activity/ActivityLogAction/ActivityLogActionContext"
import ActionIcon from "components/[guild]/activity/ActivityLogAction/components/ActionIcon"
import ActionLabel from "components/[guild]/activity/ActivityLogAction/components/ActionLabel"
import {
  ActivityLogProvider,
  useActivityLog,
} from "components/[guild]/activity/ActivityLogContext"
import useUser from "components/[guild]/hooks/useUser"
import LinkButton from "components/common/LinkButton"
import { ArrowRight, Bell } from "phosphor-react"
import GhostIcon from "static/avatars/ghost.svg"
import AccountButton from "./AccountButton"

const VIEWPORT_GAP_PX = 8

const UserActivityLogPopover = () => {
  const { id } = useUser()

  return (
    <Popover
      placement="bottom"
      isLazy
      strategy="absolute"
      modifiers={[
        { name: "preventOverflow", options: { padding: VIEWPORT_GAP_PX } },
      ]}
    >
      <PopoverTrigger>
        <AccountButton aria-label="Activity log">
          <Icon as={Bell} />
        </AccountButton>
      </PopoverTrigger>

      <PopoverContent
        minW="none"
        maxW={`calc(100vw - ${2 * VIEWPORT_GAP_PX}px)`}
        w="400px"
      >
        <PopoverArrow />

        <PopoverHeader border="0" pt="3" pb="1" px={4}>
          <Text
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
            colorScheme="gray"
          >
            Recent activity
          </Text>
        </PopoverHeader>
        <PopoverBody px={4} pt="0" pb="3">
          <ActivityLogProvider
            userId={id}
            withSearchParams={false}
            isInfinite={false}
          >
            <UserActivityLog />
          </ActivityLogProvider>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

const UserActivityLog = (): JSX.Element => {
  const { data, isValidating } = useActivityLog()

  return (
    <>
      <Stack minW="xs" spacing={0.5} divider={<Divider />}>
        {!data || isValidating ? (
          [...Array(5)].map((_, i) => (
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
          data.entries.slice(0, 5)?.map((action) => (
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
        <LinkButton
          href="/profile/activity"
          w="full"
          h="10"
          mt="2"
          colorScheme="gray"
          rightIcon={<Icon as={ArrowRight} />}
        >
          View all
        </LinkButton>
      )}
    </>
  )
}

export default UserActivityLogPopover
