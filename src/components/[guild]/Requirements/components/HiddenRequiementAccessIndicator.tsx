import {
  Collapse,
  HStack,
  Icon,
  List,
  ListIcon,
  ListItem,
  PopoverBody,
  PopoverFooter,
  PopoverHeader,
  Stack,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import {
  ArrowSquareIn,
  CaretDown,
  Check,
  DotsThree,
  IconProps,
  LockSimple,
  Warning,
  X,
} from "phosphor-react"
import capitalize from "utils/capitalize"
import {
  POPOVER_FOOTER_STYLES,
  POPOVER_HEADER_STYLES,
} from "./RequiementAccessIndicator"
import RequiementAccessIndicatorUI from "./RequiementAccessIndicatorUI"

type Props = {
  roleId: number
}

const HiddenRequiementAccessIndicator = ({ roleId }: Props) => {
  const { roles } = useGuild()
  const role = roles.find((r) => r.id === roleId)
  const { data: accessData } = useAccess(roleId)
  if (!accessData) return null

  const publicReqIds = role.requirements.map((req) => req.id)

  const hiddenReqsAccessData = accessData?.requirements?.filter(
    (reqAccessData) => !publicReqIds.includes(reqAccessData.requirementId)
  )

  const hiddenReqsErrorMessages = [
    ...new Set<string>(
      accessData?.errors
        ?.filter(
          (error) =>
            !publicReqIds.includes(error.requirementId) &&
            !["PLATFORM_NOT_CONNECTED", "PLATFORM_CONNECT_INVALID"].includes(
              error.errorType
            )
        )
        ?.map((error) => error.msg)
    ),
  ]

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

  if (
    role.logic === "AND"
      ? count.accessed === hiddenReqsAccessData.length
      : role.logic === "ANY_OF"
      ? count.accessed >= role.anyOfNum
      : count.accessed > 0
  )
    return (
      <RequiementAccessIndicatorUI
        colorScheme={"green"}
        circleBgSwatch={{ light: 400, dark: 300 }}
        icon={Check}
      >
        <HiddenRequiementAccessIndicatorPopover
          count={count}
          errorMessages={hiddenReqsErrorMessages}
        />
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
        <HiddenRequiementAccessIndicatorPopover
          count={count}
          errorMessages={hiddenReqsErrorMessages}
        />
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
        <HiddenRequiementAccessIndicatorPopover
          count={count}
          errorMessages={hiddenReqsErrorMessages}
        />
      </RequiementAccessIndicatorUI>
    )

  return (
    <RequiementAccessIndicatorUI
      colorScheme={"gray"}
      circleBgSwatch={{ light: 300, dark: 500 }}
      icon={count.notAccessed === hiddenReqsAccessData?.length ? X : DotsThree}
      isAlwaysOpen={!accessData?.access}
    >
      <HiddenRequiementAccessIndicatorPopover
        count={count}
        errorMessages={hiddenReqsErrorMessages}
      />
    </RequiementAccessIndicatorUI>
  )
}

type HiddenRequiementAccessIndicatorPopoverProps = {
  count: {
    accessed: number
    notAccessed: number
    platformErrored: number
    errored: number
  }
  errorMessages: string[]
}

const HiddenRequiementAccessIndicatorPopover = ({
  count,
  errorMessages,
}: HiddenRequiementAccessIndicatorPopoverProps) => {
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
            errorMessages={errorMessages}
          />
          <CountAccessIndicatorUI
            count={count.errored}
            colorScheme="orange"
            icon={Warning}
            label="couldn't check access"
            errorMessages={errorMessages}
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

type CountAccessIndicatorUIProps = {
  count: number
  colorScheme: string
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
  label: string
  errorMessages?: string[]
}

const CountAccessIndicatorUI = ({
  count,
  colorScheme,
  icon,
  label,
  errorMessages,
}: CountAccessIndicatorUIProps) => {
  const { isOpen, onToggle } = useDisclosure()

  if (!count) return

  if (errorMessages?.length)
    return (
      <Stack w="full" spacing={0}>
        <Button
          display="flex"
          justifyContent="start"
          w="max-content"
          h="auto"
          p={0}
          variant="unstyled"
          fontWeight="normal"
          onClick={onToggle}
          leftIcon={
            <Tag colorScheme={colorScheme} px="2" py="2" flexShrink={0}>
              <Icon as={icon} boxSize="3" />
            </Tag>
          }
          rightIcon={
            <Icon
              as={CaretDown}
              boxSize={3}
              transition="transform 0.2s ease"
              transform={`rotate(${isOpen ? "-180" : "0"}deg)`}
            />
          }
        >
          <Text as="span" fontWeight={"semibold"}>
            {count}
          </Text>
          {` ${label}`}
        </Button>

        <Collapse in={isOpen} animateOpacity>
          <Stack pt={1.5} pl={9} spacing={0.5}>
            <Text
              as="span"
              fontWeight="bold"
              fontSize="xs"
              textTransform="uppercase"
              colorScheme="gray"
            >
              {count > 1 ? "Errors:" : "Error:"}
            </Text>
            <List fontSize="sm">
              {errorMessages.map((msg, i) => (
                <ListItem key={i}>
                  <ListIcon
                    as={Warning}
                    weight="fill"
                    color="gray.500"
                    position="relative"
                    top={-0.5}
                    mr={1}
                  />
                  <Text as="span" colorScheme="gray">
                    {capitalize(msg)}
                  </Text>
                </ListItem>
              ))}
            </List>
          </Stack>
        </Collapse>
      </Stack>
    )

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
