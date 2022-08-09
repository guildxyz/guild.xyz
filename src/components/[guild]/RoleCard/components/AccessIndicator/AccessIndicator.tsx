import {
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { Check, LockSimple, Warning, X } from "phosphor-react"
import { PlatformName } from "types"
import joinWithUniqueLastSeparator from "utils/joinWithUniqueLastSeparator"
import msToDayHourMinute, { UNIT_LABELS } from "utils/msToDayHourMinute"
import pluralize from "utils/pluralize"
import AccessIndicatorUI, {
  ACCESS_INDICATOR_STYLES,
} from "./components/AccessIndicatorUI"

type Props = {
  roleId: number
}

const platformRequirementPrefxes: Partial<Record<PlatformName, string>> = {
  TWITTER: "Twitter",
  GITHUB: "GitHub",
}

const TWITTER_RATE_LIMIT_REGEX =
  /^Will refresh after (.*) \(Twitter API Rate-Limit\)$/i

const useTwitterRateLimitError = (accesses, roleId) => {
  const roleAccess = accesses?.find((_) => _.roleId === roleId)

  if (
    roleAccess?.errors?.every((err) => TWITTER_RATE_LIMIT_REGEX.test(err.msg)) ||
    roleAccess?.warnings?.every((err) => TWITTER_RATE_LIMIT_REGEX.test(err.msg))
  ) {
    return (
      roleAccess?.errors?.find((err) => TWITTER_RATE_LIMIT_REGEX.test(err.msg)) ||
      roleAccess?.warnings?.find((err) => TWITTER_RATE_LIMIT_REGEX.test(err.msg))
    )
  } else {
    return undefined
  }
}

const useTwitterRateLimitTooltipLabel = (twitterRateLimitError) => {
  if (!twitterRateLimitError) return null

  const retryAfterDate = +new Date(
    twitterRateLimitError.msg?.match(TWITTER_RATE_LIMIT_REGEX)?.[1]
  )

  const timeDiff = retryAfterDate - Date.now()

  const reconnectIn = joinWithUniqueLastSeparator(
    msToDayHourMinute(timeDiff)
      .map((diff, index) => (diff > 0 ? pluralize(diff, UNIT_LABELS[index]) : null))
      .filter((item) => !!item)
  )

  return `Twitter account usage over limit, please try reconnecting it, or wait ${reconnectIn} for the limit to reset`
}

const AccessIndicator = ({ roleId }: Props): JSX.Element => {
  const { isActive } = useWeb3React()
  const { hasAccess, error, isLoading, data } = useAccess(roleId)
  const { roles } = useGuild()
  const role = roles?.find(({ id }) => id === roleId)
  const openJoinModal = useOpenJoinModal()
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (!isActive)
    return (
      <Button
        leftIcon={!isMobile && <LockSimple width={"0.9em"} height="0.9em" />}
        rightIcon={isMobile && <LockSimple width={"0.9em"} height="0.9em" />}
        size="sm"
        borderRadius="lg"
        onClick={openJoinModal}
        {...ACCESS_INDICATOR_STYLES}
      >
        Join Guild to check access
      </Button>
    )

  if (hasAccess)
    return (
      <AccessIndicatorUI colorScheme="green" label="You have access" icon={Check} />
    )

  if (isLoading)
    return <AccessIndicatorUI colorScheme="gray" label="Checking access" isLoading />

  const roleError = (data ?? error)?.find?.((err) => err.roleId === roleId)

  const rolePlatformRequirementIds = new Set(
    role?.requirements
      ?.filter(({ type }) =>
        Object.keys(platformRequirementPrefxes).some((platformName) =>
          type.startsWith(platformName)
        )
      )
      ?.map(({ id }) => id) ?? []
  )

  if (
    roleError?.warnings?.every((err) =>
      rolePlatformRequirementIds.has(err.requirementId)
    ) ||
    roleError?.errors?.every((err) =>
      rolePlatformRequirementIds.has(err.requirementId)
    )
  ) {
    return (
      <AccessIndicatorUI
        colorScheme="blue"
        label={"Connect below to check access"}
        icon={LockSimple}
      />
    )
  }

  if (Array.isArray(error) && roleError?.errors)
    return (
      <AccessIndicatorUI
        colorScheme="orange"
        label="Couldn’t check access"
        icon={Warning}
      />
    )

  return <AccessIndicatorUI colorScheme="gray" label="No access" icon={X} />
}

const AccessIndicatorWithAlert = ({
  roleId,
  isTwitterPopoverOpen,
  onTwitterPopoverClose,
}: Props & {
  isTwitterPopoverOpen: boolean
  onTwitterPopoverClose: () => void
}) => {
  const { error, data } = useAccess(roleId)

  const twitterRateLimitError = useTwitterRateLimitError(data ?? error, roleId)

  const rateLimitTooltipLabel =
    useTwitterRateLimitTooltipLabel(twitterRateLimitError)

  if (!twitterRateLimitError) return <AccessIndicator roleId={roleId} />

  return (
    <HStack spacing={4}>
      <AccessIndicator roleId={roleId} />
      <Popover
        isOpen={isTwitterPopoverOpen || undefined}
        trigger="hover"
        closeOnEsc={!isTwitterPopoverOpen}
        closeOnBlur={!isTwitterPopoverOpen}
      >
        <PopoverTrigger>
          <Warning color="orange" />
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <VStack alignItems={"end"}>
                <Text>{rateLimitTooltipLabel}</Text>
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={onTwitterPopoverClose}
                >
                  Got it
                </Button>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </HStack>
  )
}

export default AccessIndicatorWithAlert
