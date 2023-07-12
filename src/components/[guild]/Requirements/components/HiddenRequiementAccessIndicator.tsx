import {
  HStack,
  Icon,
  PopoverBody,
  PopoverFooter,
  PopoverHeader,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Button from "components/common/Button"
import {
  ArrowSquareIn,
  Check,
  DotsThree,
  LockSimple,
  Warning,
  X,
} from "phosphor-react"
import {
  POPOVER_FOOTER_STYLES,
  POPOVER_HEADER_STYLES,
} from "./RequiementAccessIndicator"
import RequiementAccessIndicatorUI from "./RequiementAccessIndicatorUI"

const HiddenRequiementAccessIndicator = ({ roleId }) => {
  const { roles } = useGuild()
  const { data: accessData } = useAccess(roleId)
  if (!accessData) return null

  const publicReqIds = roles
    .find((role) => role.id === roleId)
    .requirements.map((req) => req.id)

  const hiddenReqsAccessData = accessData?.requirements?.filter(
    (reqAccessData) => !publicReqIds.includes(reqAccessData.requirementId)
  )

  const count = hiddenReqsAccessData.reduce(
    (acc, curr) => {
      if (curr.access) {
        acc.accessed += 1
        return acc
      }

      const reqError = accessData?.errors?.find(
        (obj) => obj.requirementId === curr.requirementId
      )
      if (!reqError) {
        acc.notAccessed += 1
        return acc
      }

      if (
        ["PLATFORM_NOT_CONNECTED", "PLATFORM_CONNECT_INVALID"].includes(
          reqError.errorType
        )
      ) {
        acc.platformErrored += 1
        return acc
      }

      acc.errored += 1
      return acc
    },
    {
      accessed: 0,
      notAccessed: 0,
      platformErrored: 0,
      errored: 0,
    }
  )

  if (count.accessed === hiddenReqsAccessData?.length)
    return (
      <RequiementAccessIndicatorUI
        colorScheme={"green"}
        circleBgSwatch={{ light: 400, dark: 300 }}
        icon={Check}
      >
        <HiddenRequiementAccessIndicatorPopover count={count} />
      </RequiementAccessIndicatorUI>
    )

  if (count.platformErrored === hiddenReqsAccessData?.length)
    return (
      <RequiementAccessIndicatorUI
        colorScheme={"blue"}
        circleBgSwatch={{ light: 300, dark: 300 }}
        icon={LockSimple}
        isAlwaysOpen={!accessData?.access}
      >
        <HiddenRequiementAccessIndicatorPopover count={count} />
      </RequiementAccessIndicatorUI>
    )

  if (count.errored === hiddenReqsAccessData?.length)
    return (
      <RequiementAccessIndicatorUI
        colorScheme={"orange"}
        circleBgSwatch={{ light: 300, dark: 300 }}
        icon={Warning}
        isAlwaysOpen={!accessData?.access}
      >
        <HiddenRequiementAccessIndicatorPopover count={count} />
      </RequiementAccessIndicatorUI>
    )

  return (
    <RequiementAccessIndicatorUI
      colorScheme={"gray"}
      circleBgSwatch={{ light: 300, dark: 500 }}
      icon={count.notAccessed === hiddenReqsAccessData?.length ? X : DotsThree}
      isAlwaysOpen={!accessData?.access}
    >
      <HiddenRequiementAccessIndicatorPopover count={count} />
    </RequiementAccessIndicatorUI>
  )
}

const HiddenRequiementAccessIndicatorPopover = ({ count }) => {
  const { openAccountModal } = useWeb3ConnectionManager()

  return (
    <>
      <PopoverHeader {...POPOVER_HEADER_STYLES}>
        {`Satisfaction of secret requirements with your connected accounts:`}
      </PopoverHeader>
      <PopoverBody>
        <Stack>
          <CountAccessIndicatorUI
            count={count.accessed}
            colorScheme="green"
            icon={Check}
            label="satisfied"
          />
          <CountAccessIndicatorUI
            count={count.notAccessed}
            colorScheme="gray"
            icon={X}
            label="not satisfied"
          />
          <CountAccessIndicatorUI
            count={count.platformErrored}
            colorScheme="blue"
            icon={LockSimple}
            label="connect / reconnect needed"
          />
          <CountAccessIndicatorUI
            count={count.errored}
            colorScheme="orange"
            icon={Warning}
            label="couldn't check access"
          />
        </Stack>
      </PopoverBody>
      <PopoverFooter {...POPOVER_FOOTER_STYLES} pt="3">
        <Button
          size="sm"
          rightIcon={<Icon as={ArrowSquareIn} />}
          onClick={openAccountModal}
        >
          {`View connected accounts`}
        </Button>
      </PopoverFooter>
    </>
  )
}

const CountAccessIndicatorUI = ({ count, colorScheme, icon, label }) => {
  if (!count) return

  return (
    <HStack>
      <Tag colorScheme={colorScheme} px="2" py="2" flexShrink={0}>
        <Icon as={icon} boxSize="3" />
      </Tag>
      <Text>
        <Text as="span" fontWeight={"semibold"}>
          {count}
        </Text>
        {` ${label}`}
      </Text>
    </HStack>
  )
}

export default HiddenRequiementAccessIndicator
