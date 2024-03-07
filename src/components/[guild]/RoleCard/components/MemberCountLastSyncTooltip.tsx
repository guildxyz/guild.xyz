import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  TagRightIcon,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Info, UserSwitch } from "phosphor-react"
import { useFetcherWithSign } from "utils/fetcher"
import formatRelativeTimeFromNow from "utils/formatRelativeTimeFromNow"

const MemberCountLastSyncTooltip = ({ lastSyncedAt, roleId }) => {
  const date = new Date(lastSyncedAt)
  const readableDate = lastSyncedAt
    ? formatRelativeTimeFromNow(date.getTime() / 1000)
    : "unknown"
  const { isSuperAdmin } = useUser()

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
          >{`Last synced all member accesses ${readableDate} ago`}</PopoverHeader>
          {isSuperAdmin && (
            <PopoverFooter
              pt={0}
              pb={3}
              display="flex"
              justifyContent={"flex-end"}
              border={0}
            >
              <SyncRoleButton roleId={roleId} />
            </PopoverFooter>
          )}
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

const SyncRoleButton = ({ roleId }) => {
  const fetcherWithSign = useFetcherWithSign()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = () =>
    fetcherWithSign([
      "/v2/periodic-sync/roles",
      { method: "POST", body: { roleId } },
    ])

  const { onSubmit, isLoading } = useSubmit(submit, {
    onSuccess: () => {
      toast({ status: "success", title: "Successfully started syncing members" })
    },
    onError: (err) => {
      showErrorToast(err)
    },
  })

  return (
    <Button
      size="sm"
      h="7"
      fontSize="xs"
      variant="outline"
      leftIcon={<UserSwitch />}
      borderRadius="lg"
      borderWidth="1.5px"
      onClick={onSubmit}
      isLoading={isLoading}
    >
      Sync all member accesses
    </Button>
  )
}

export default MemberCountLastSyncTooltip
