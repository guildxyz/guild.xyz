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
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/hooks/useIsMember"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { useRequirementErrorConfig } from "components/[guild]/Requirements/RequirementErrorConfigContext"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
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
  const { roles } = useGuild()
  const role = roles.find((r) => r.id === roleId)
  const { hasAccess, data, error, isLoading: isValidating } = useAccess(roleId)
  const accessedRequirementCount = data?.requirements?.filter(
    (r) => r.access
  )?.length

  const { openAccountModal } = useWeb3ConnectionManager()
  const { isActive } = useWeb3React()
  const isMember = useIsMember()
  const openJoinModal = useOpenJoinModal()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const dividerColor = useColorModeValue("green.400", "whiteAlpha.400")

  const requirements = roles.find((r) => r.id === roleId)?.requirements ?? []
  const requirementIdsWithErrors =
    data?.requirements?.filter((r) => r.access === null) ?? []
  const requirementsWithErrors = requirements.filter((req) =>
    requirementIdsWithErrors.some(({ requirementId }) => requirementId === req.id)
  )
  const errors = useRequirementErrorConfig()
  const firstRequirementWithErrorFromConfig = requirementsWithErrors.find(
    (req) => !!errors[req.type.split("_")[0]]
  )
  const errorTextFromConfig =
    requirementsWithErrors.length > 0 &&
    errors[firstRequirementWithErrorFromConfig?.type.split("_")[0]]

  if (!isActive || (hasAccess && !isMember))
    return (
      <Button
        leftIcon={!isMobile && <LockSimple width={"0.9em"} height="0.9em" />}
        rightIcon={isMobile && <LockSimple width={"0.9em"} height="0.9em" />}
        size="sm"
        borderRadius="lg"
        onClick={openJoinModal}
        {...ACCESS_INDICATOR_STYLES}
      >
        {`Join Guild to ${hasAccess ? "get" : "check"} access`}
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
          // Card's `overflow: clip` isn't enough in Safari
          borderBottomRightRadius={{ base: "2xl", md: "lg" }}
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

  if (isValidating)
    return <AccessIndicatorUI colorScheme="gray" label="Checking access" isLoading />

  if (errorTextFromConfig)
    return (
      <AccessIndicatorUI
        colorScheme="orange"
        label={errorTextFromConfig}
        icon={Warning}
      />
    )

  if (data?.errors?.some((err) => err.errorType === "PLATFORM_CONNECT_INVALID"))
    return (
      <AccessIndicatorUI
        colorScheme="orange"
        label="Reconnect needed to check access"
        icon={Warning}
        onClick={() => openAccountModal()}
        cursor="pointer"
      />
    )

  if (data?.errors?.some((err) => err.errorType === "PLATFORM_NOT_CONNECTED"))
    return (
      <AccessIndicatorUI
        colorScheme="blue"
        label="Connect needed to check access"
        icon={LockSimple}
        onClick={() => openAccountModal()}
        cursor="pointer"
      />
    )

  if (data?.errors || error)
    return (
      <AccessIndicatorUI
        colorScheme="orange"
        label="Couldn’t check access"
        icon={Warning}
      />
    )

  return (
    <AccessIndicatorUI
      colorScheme="gray"
      label={`No access${
        role.logic === "ANY_OF" && typeof accessedRequirementCount === "number"
          ? ` (${accessedRequirementCount}/${role.anyOfNum})`
          : ""
      }`}
      icon={X}
    />
  )
}

export default AccessIndicator
