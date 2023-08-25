import {
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  SkeletonCircle,
  Stack,
  Tooltip,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { ActivityLogActionProvider } from "components/[guild]/activity/ActivityLogAction/ActivityLogActionContext"
import ActionIcon from "components/[guild]/activity/ActivityLogAction/components/ActionIcon"
import ActionLabel from "components/[guild]/activity/ActivityLogAction/components/ActionLabel"
import {
  ActivityLogProvider,
  useActivityLog,
} from "components/[guild]/activity/ActivityLogContext"
import useUser from "components/[guild]/hooks/useUser"
import { ArrowRight, UserList } from "phosphor-react"
import AccountButton from "./AccountButton"

const UserActivityLogPopover = () => {
  const { id } = useUser()

  return (
    <Popover placement="bottom" isLazy strategy="fixed">
      <PopoverTrigger>
        <AccountButton aria-label="Activity log">
          <Icon as={UserList} />
        </AccountButton>
      </PopoverTrigger>

      <PopoverContent minW="none" maxW="none" w="full">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          px={3}
        >
          Recent activity
        </PopoverHeader>

        <PopoverBody p={3}>
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
    <Stack spacing={3}>
      {!data || isValidating
        ? [...Array(5)].map((_, i) => (
            <HStack key={i} spacing={4}>
              <SkeletonCircle boxSize={6} />
              <Skeleton h={5} w={36} />
              <Skeleton h={5} w={20} />
            </HStack>
          ))
        : data.entries.slice(0, 5)?.map((action) => (
            <ActivityLogActionProvider key={action.id} action={action}>
              <HStack spacing={4}>
                <ActionIcon size={5} />
                <ActionLabel />
              </HStack>
            </ActivityLogActionProvider>
          ))}

      <Tooltip placement="bottom" label="Coming soon" hasArrow>
        <Button
          w="full"
          size="sm"
          variant="solid"
          rightIcon={<Icon as={ArrowRight} />}
          isDisabled
        >
          View all
        </Button>
      </Tooltip>
    </Stack>
  )
}

export default UserActivityLogPopover
