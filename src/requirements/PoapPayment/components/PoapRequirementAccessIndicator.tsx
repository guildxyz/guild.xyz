import {
  Icon,
  PopoverBody,
  PopoverFooter,
  PopoverHeader,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useUserPoapEligibility from "components/[guild]/claim-poap/hooks/useUserPoapEligibility"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import RequiementAccessIndicatorUI from "components/[guild]/Requirements/components/RequiementAccessIndicatorUI"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { ArrowSquareIn, Check, LockSimple, Warning, X } from "phosphor-react"
import REQUIREMENTS from "requirements"

/**
 * This is copy-pasted from RequiementAccessIndicator and adjusted to work with
 * legacy POAP logic. Will delete once POAP is a real reward
 */
const PoapRequiementAccessIndicator = ({ poapIdentifier }) => {
  const { openAccountModal } = useWeb3ConnectionManager()
  const { id, type, data, isNegated } = useRequirementContext()

  const { data: accessData } = useUserPoapEligibility(poapIdentifier)
  if (!accessData) return null

  const reqAccessData = accessData?.requirements?.find(
    (obj) => obj.requirementId === id
  )

  if (reqAccessData?.access || (accessData?.hasPaid && !reqAccessData))
    return (
      <RequiementAccessIndicatorUI
        colorScheme={"green"}
        circleBgSwatch={{ light: 400, dark: 300 }}
        icon={Check}
      >
        <PopoverHeader {...POPOVER_HEADER_STYLES}>
          <Text as="span" mr="2">
            🎉
          </Text>
          Requirement satisfied
        </PopoverHeader>
      </RequiementAccessIndicatorUI>
    )

  const reqErrorData = accessData?.errors?.find((obj) => obj.requirementId === id)

  if (reqErrorData?.errorType === "PLATFORM_NOT_CONNECTED")
    return (
      <RequiementAccessIndicatorUI
        colorScheme={"blue"}
        circleBgSwatch={{ light: 300, dark: 300 }}
        icon={LockSimple}
        isAlwaysOpen={!accessData?.access}
      >
        <PopoverHeader {...POPOVER_HEADER_STYLES}>
          Connect account to check access
        </PopoverHeader>
        <PopoverFooter {...POPOVER_FOOTER_STYLES}>
          <ConnectRequirementPlatformButton size="sm" iconSpacing={2} />
        </PopoverFooter>
      </RequiementAccessIndicatorUI>
    )

  if (reqAccessData?.access === null || reqErrorData) {
    return (
      <RequiementAccessIndicatorUI
        colorScheme={"orange"}
        circleBgSwatch={{ light: 300, dark: 300 }}
        icon={Warning}
        isAlwaysOpen={!accessData?.access}
      >
        <PopoverHeader {...POPOVER_HEADER_STYLES}>
          {reqErrorData?.msg
            ? `Error: ${reqErrorData.msg}`
            : `Couldn't check access`}
        </PopoverHeader>
      </RequiementAccessIndicatorUI>
    )
  }

  const reqObj = REQUIREMENTS[type]

  return (
    <RequiementAccessIndicatorUI
      colorScheme={"gray"}
      circleBgSwatch={{ light: 300, dark: 500 }}
      icon={X}
      isAlwaysOpen={!accessData?.access}
    >
      <PopoverHeader {...POPOVER_HEADER_STYLES}>
        {`Requirement not satisfied with your connected ${
          reqObj?.isPlatform ? "account" : "addresses"
        }`}
      </PopoverHeader>
      {reqAccessData?.amount !== null && data?.minAmount && (
        <PopoverBody pt="0">
          {isNegated
            ? `Expected max amount is ${data.minAmount} and you have ${reqAccessData?.amount}`
            : `Expected amount is ${data.minAmount} but you only have ${reqAccessData?.amount}`}
        </PopoverBody>
      )}
      <PopoverFooter {...POPOVER_FOOTER_STYLES}>
        <Button
          size="sm"
          rightIcon={<Icon as={ArrowSquareIn} />}
          onClick={openAccountModal}
        >
          {`View connected ${reqObj?.isPlatform ? "account" : "addresses"}`}
        </Button>
      </PopoverFooter>
    </RequiementAccessIndicatorUI>
  )
}

const POPOVER_HEADER_STYLES = {
  fontWeight: "semibold",
  border: "0",
  px: "3",
}

const POPOVER_FOOTER_STYLES = {
  display: "flex",
  justifyContent: "flex-end",
  border: "0",
  pt: "2",
}

export default PoapRequiementAccessIndicator
