import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Warning } from "phosphor-react"
import joinWithUniqueLastSeparator from "utils/joinWithUniqueLastSeparator"
import msToDayHourMinute, { UNIT_LABELS } from "utils/msToDayHourMinute"
import pluralize from "utils/pluralize"

const TWITTER_RATE_LIMIT_REGEX =
  /^Will refresh after (.*) \(Twitter API Rate-Limit\)$/i

const useTwitterRateLimitWarning = (accesses, roleId) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  const roleAccess = accesses?.find?.((_) => _.roleId === roleId)

  const twitterRateLimitError =
    roleAccess?.errors?.find((err) => TWITTER_RATE_LIMIT_REGEX.test(err.msg)) ||
    roleAccess?.warnings?.find((err) => TWITTER_RATE_LIMIT_REGEX.test(err.msg))

  if (!twitterRateLimitError) return undefined

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
            <VStack alignItems={"end"}>
              <Text>{`Twitter account usage limit exceeded, your access might not be up to date. Try reconnecting your account, or wait ${reconnectIn} for the limit to reset`}</Text>
              <Button size="sm" colorScheme="green" onClick={onClose}>
                Got it
              </Button>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export default useTwitterRateLimitWarning
