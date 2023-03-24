import {
  Box,
  Divider,
  HStack,
  Icon,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useAccess from "components/[guild]/hooks/useAccess"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { CaretDown, Check, LockSimple, Warning, X } from "phosphor-react"
import AccessIndicatorUI, {
  ACCESS_INDICATOR_STYLES,
} from "./components/AccessIndicatorUI"

type Props = {
  roleId: number
  isOpen: any
  onToggle: any
}

const AccessIndicator = ({ roleId, isOpen, onToggle }: Props): JSX.Element => {
  const { hasAccess, isLoading, data } = useAccess(roleId)

  const { isActive } = useWeb3React()
  const openJoinModal = useOpenJoinModal()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const dividerColor = useColorModeValue("green.400", "whiteAlpha.400")

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
      <HStack spacing="0" flexShrink={0}>
        <AccessIndicatorUI
          colorScheme="green"
          label="You have access"
          icon={Check}
          flex="1 0 auto"
          borderTopRightRadius="0 !important"
          borderBottomRightRadius="0 !important"
        />
        <Divider orientation="vertical" h="8" borderColor={dividerColor} />
        <Button
          size="sm"
          {...ACCESS_INDICATOR_STYLES}
          borderTopLeftRadius="0 !important"
          borderBottomLeftRadius="0 !important"
          iconSpacing="0"
          rightIcon={
            <Icon
              as={CaretDown}
              transform={isOpen && "rotate(-180deg)"}
              transition="transform .3s"
            />
          }
          onClick={onToggle}
        >
          <Box
            w={isOpen ? "0" : "90px"}
            transition={"width .2s"}
            overflow="hidden"
            textAlign={"left"}
          >
            View details
          </Box>
        </Button>
      </HStack>
    )

  if (isLoading)
    return <AccessIndicatorUI colorScheme="gray" label="Checking access" isLoading />

  if (data?.errors?.some((err) => err.errorType === "PLATFORM_CONNECT_INVALID")) {
    return (
      <AccessIndicatorUI
        colorScheme="orange"
        label={"Reconnect needed to check access"}
        icon={Warning}
      />
    )
  }

  if (data?.errors?.some((err) => err.errorType === "PLATFORM_NOT_CONNECTED")) {
    return (
      <AccessIndicatorUI
        colorScheme="blue"
        label={"Auth needed to check access"}
        icon={LockSimple}
      />
    )
  }

  if (data?.errors)
    return (
      <AccessIndicatorUI
        colorScheme="orange"
        label="Couldn’t check access"
        icon={Warning}
      />
    )

  return <AccessIndicatorUI colorScheme="gray" label="No access" icon={X} />
}

export default AccessIndicator
