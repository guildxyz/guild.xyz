import {
  Icon,
  PopoverBody,
  PopoverFooter,
  PopoverHeader,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useAccess from "components/[guild]/hooks/useAccess"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { ArrowSquareIn, Check, LockSimple, Warning, X } from "phosphor-react"
import { useContext } from "react"
import REQUIREMENTS from "requirements"
import ConnectRequirementPlatformButton from "./ConnectRequirementPlatformButton"
import RequiementAccessIndicatorUI from "./RequiementAccessIndicatorUI"
import { useRequirementContext } from "./RequirementContext"

const RequiementAccessIndicator = () => {
  const { openAccountModal } = useContext(Web3Connection)
  const { id, roleId, type, data, isNegated } = useRequirementContext()

  const { data: accessData } = useAccess(roleId)
  if (!accessData) return null

  const reqAccessData = accessData?.requirements?.find(
    (obj) => obj.requirementId === id
  )

  if (reqAccessData?.access)
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
          {reqErrorData.msg ? `Error: ${reqErrorData.msg}` : `Couldn't check access`}
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

export default RequiementAccessIndicator
