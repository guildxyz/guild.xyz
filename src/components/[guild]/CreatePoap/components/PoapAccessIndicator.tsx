import { useBreakpointValue } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useUserPoapEligibility from "components/[guild]/claim-poap/hooks/useUserPoapEligibility"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import AccessIndicatorUI, {
  ACCESS_INDICATOR_STYLES,
} from "components/[guild]/RoleCard/components/AccessIndicator/components/AccessIndicatorUI"
import { Check, LockSimple, Warning, X } from "phosphor-react"

type Props = {
  poapIdentifier: number
}

/**
 * This is copy-pasted from RequiementAccessIndicator and adjusted to work with
 * legacy POAP logic. Will delete once POAP is a real reward
 */
const PoapAccessIndicator = ({ poapIdentifier }: Props): JSX.Element => {
  const { isLoading, data } = useUserPoapEligibility(poapIdentifier)

  const { isActive } = useWeb3React()
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

  if (data?.access)
    return (
      <AccessIndicatorUI colorScheme="green" label="You have access" icon={Check} />
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

export default PoapAccessIndicator
