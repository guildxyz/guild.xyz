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
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useUser from "components/[guild]/hooks/useUser"
import { Warning } from "phosphor-react"
import joinWithUniqueLastSeparator from "utils/joinWithUniqueLastSeparator"
import msToDayHourMinute, { UNIT_LABELS } from "utils/msToDayHourMinute"
import pluralize from "utils/pluralize"

const DISCORD_RATE_LIMIT_REGEX =
  /^Will refresh after (.*) \(Discord API Rate-Limit\)$/i

const useDiscordRateLimitWarning = (accesses, roleId) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const { platformUsers } = useUser()

  const roleAccess = accesses?.find?.((_) => _.roleId === roleId)

  const discordRateLimitError =
    roleAccess?.errors?.find((err) => DISCORD_RATE_LIMIT_REGEX.test(err.msg)) ||
    roleAccess?.warnings?.find((err) => DISCORD_RATE_LIMIT_REGEX.test(err.msg))

  if (
    !discordRateLimitError ||
    platformUsers?.every?.((_) => _.platformName !== "DISCORD")
  )
    return undefined

  const retryAfterDate = +new Date(
    discordRateLimitError.msg?.match(DISCORD_RATE_LIMIT_REGEX)?.[1]
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
            <Text>{`Your access might not be up to date due to Discord limitations. Please wait ${
              reconnectIn || "a bit"
            } for the limit to reset`}</Text>
          </PopoverBody>
          <PopoverFooter border="none" display="flex">
            <Button ml="auto" size="sm" colorScheme="green" onClick={onClose}>
              Got it
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export default useDiscordRateLimitWarning
