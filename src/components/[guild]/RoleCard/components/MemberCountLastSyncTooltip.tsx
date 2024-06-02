import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  TagRightIcon,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Info, UserSwitch } from "phosphor-react"
import { PropsWithChildren, useMemo } from "react"
import fetcher from "utils/fetcher"
import formatRelativeTimeFromNow, {
  DAY_IN_MS,
  MINUTE_IN_MS,
} from "utils/formatRelativeTimeFromNow"

const HOUR_IN_MS = MINUTE_IN_MS * 60

const MemberCountLastSyncTooltip = ({
  lastSyncedAt,
  children,
}: PropsWithChildren<{ lastSyncedAt: string }>) => {
  const readableDate = useMemo(() => {
    if (!lastSyncedAt) return "unknown"

    const date = new Date(lastSyncedAt)
    const timeDifference = Date.now() - date.getTime()

    const sinceHours = timeDifference / HOUR_IN_MS
    if (sinceHours < 1) return "less than an hour"

    const sinceDays = timeDifference / DAY_IN_MS
    if (sinceDays < 1) return "less than a day"

    const sinceWeeks = timeDifference / (DAY_IN_MS * 7)
    if (sinceWeeks >= 1) return "more than a week"

    return formatRelativeTimeFromNow(timeDifference)
  }, [lastSyncedAt])

  return (
    <Popover trigger="hover" placement="bottom" isLazy>
      <PopoverTrigger>
        <TagRightIcon
          as={Info}
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition={"opacity .2s"}
          mt="1px"
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent minW="max-content">
          <PopoverArrow />
          <PopoverHeader
            border="0"
            px={3}
            fontSize={"sm"}
            fontWeight={"medium"}
          >{`Last updated all member accesses ${readableDate} ago`}</PopoverHeader>
          {children}
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export const SyncRoleButton = ({ roleId }) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = () =>
    // TODO: use fetcherWithSign (with params in array) when the BE will add auth back
    fetcher("/v2/periodic-sync/roles", { method: "POST", body: { roleId } })

  const { onSubmit, isLoading } = useSubmit(submit, {
    onSuccess: () => {
      toast({
        status: "success",
        title: "Successfully moved job to the start of the queue",
      })
    },
    onError: (err) => {
      showErrorToast(err)
    },
  })

  return (
    <Button
      size="sm"
      variant="outline"
      leftIcon={<UserSwitch />}
      borderRadius="lg"
      borderWidth="1.5px"
      onClick={onSubmit}
      isLoading={isLoading}
    >
      Update all member accesses
    </Button>
  )
}

export default MemberCountLastSyncTooltip
