import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure,
  Wrap,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useDisconnect from "components/common/Layout/components/Account/components/AccountModal/hooks/useDisconnect"
import useUser from "components/[guild]/hooks/useUser"
import { Warning } from "phosphor-react"
import joinWithUniqueLastSeparator from "utils/joinWithUniqueLastSeparator"
import msToDayHourMinute, { UNIT_LABELS } from "utils/msToDayHourMinute"
import pluralize from "utils/pluralize"

const TWITTER_RATE_LIMIT_REGEX =
  /^Will refresh after (.*) \(Twitter API Rate-Limit\)$/i

const useTwitterRateLimitWarning = (accesses, roleId) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const { platformUsers } = useUser()

  const { onSubmit, isLoading } = useDisconnect()
  const disconnectAccount = () => onSubmit({ platformName: "TWITTER" })

  const roleAccess = accesses?.find?.((_) => _.roleId === roleId)

  const twitterRateLimitError =
    roleAccess?.errors?.find((err) => TWITTER_RATE_LIMIT_REGEX.test(err.msg)) ||
    roleAccess?.warnings?.find((err) => TWITTER_RATE_LIMIT_REGEX.test(err.msg))

  if (
    !twitterRateLimitError ||
    platformUsers?.every?.((_) => _.platformName !== "TWITTER")
  )
    return undefined

  const retryAfterDate = +new Date(
    twitterRateLimitError.msg?.match(TWITTER_RATE_LIMIT_REGEX)?.[1]
  )

  const timeDiff = retryAfterDate - Date.now()

  const reconnectIn = joinWithUniqueLastSeparator(
    msToDayHourMinute(timeDiff)
      .map((diff, index) => (diff > 0 ? pluralize(diff, UNIT_LABELS[index]) : null))
      .filter((item) => !!item)
  )

  return (
    <Popover
      isOpen={isOpen || undefined}
      trigger="hover"
      openDelay={0}
      closeOnEsc={!isOpen}
      closeOnBlur={!isOpen}
    >
      <PopoverTrigger>
        <Warning color="orange" />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            <Text>{`Your access might not be up to date due to Twitter limitations. Try reconnecting your account, or wait ${reconnectIn} for the limit to reset`}</Text>
          </PopoverBody>
          <PopoverFooter border="none" display="flex">
            <Wrap ml="auto">
              <Button size="sm" onClick={disconnectAccount} isLoading={isLoading}>
                Disconnect account
              </Button>
              <Button size="sm" colorScheme="green" onClick={onClose}>
                Got it
              </Button>
            </Wrap>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export default useTwitterRateLimitWarning
