import { useBreakpointValue } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useAccess from "components/[guild]/hooks/useAccess"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { ArrowCounterClockwise, Check, LockSimple, Warning, X } from "phosphor-react"
import AccessIndicatorUI, {
  ACCESS_INDICATOR_STYLES,
} from "./components/AccessIndicatorUI"
import useTwitterRateLimitWarning from "./hooks/useTwitterRateLimitWarning"

type Props = {
  roleId: number
}

const reconnectionErrorMessages = new Set<string>([
  "Discord API error: You are being rate limited.",
  "Please reatuhenticate to Discord",
])

const AccessIndicator = ({ roleId }: Props): JSX.Element => {
  const { hasAccess, error, isLoading, data } = useAccess(roleId)
  const twitterRateLimitWarning = useTwitterRateLimitWarning(data ?? error, roleId)

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

  if (hasAccess)
    return (
      <AccessIndicatorUI colorScheme="green" label="You have access" icon={Check} />
    )

  if (isLoading)
    return <AccessIndicatorUI colorScheme="gray" label="Checking access" isLoading />

  const roleError = (data ?? error)?.find?.((err) => err.roleId === roleId)

  if (roleError?.errors?.some((err) => reconnectionErrorMessages.has(err.msg))) {
    return (
      <AccessIndicatorUI
        colorScheme="orange"
        label={"Reconnect below to check access"}
        icon={ArrowCounterClockwise}
      />
    )
  }

  if (
    roleError?.warnings?.some(
      (err) =>
        typeof err.msg === "string" && err.msg.includes("account isn't connected")
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
      <>
        <AccessIndicatorUI
          colorScheme="orange"
          label="Couldn’t check access"
          icon={Warning}
        />
        {twitterRateLimitWarning}
      </>
    )

  return (
    <>
      <AccessIndicatorUI colorScheme="gray" label="No access" icon={X} />
      {twitterRateLimitWarning}
    </>
  )
}

export { reconnectionErrorMessages }
export default AccessIndicator
