import {
  Icon,
  PopoverBody,
  PopoverFooter,
  PopoverHeader,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useAccess from "components/[guild]/hooks/useAccess"
import { ArrowSquareIn, Check, Warning, X } from "phosphor-react"
import REQUIREMENTS from "requirements"
import { Requirement } from "types"
import RequiementAccessIndicatorUI from "./RequiementAccessIndicatorUI"

type Props = {
  requirement: Requirement
}

const RequiementAccessIndicator = ({ requirement }: Props) => {
  const { data: accessData } = useAccess(requirement.roleId)
  if (!accessData) return null

  const reqAccessData = accessData?.requirements?.find(
    (obj) => obj.requirementId === requirement.id
  )
  const isPlatform = REQUIREMENTS[requirement.type]?.isPlatform

  if (reqAccessData?.access)
    return (
      <RequiementAccessIndicatorUI
        colorScheme={"green"}
        icon={Check}
        popoverWidth={"4xs"}
      >
        <PopoverHeader fontWeight={"semibold"} border="0" px="3">
          <Text as="span" mr="2">
            🎉
          </Text>
          Requirement satisfied
        </PopoverHeader>
      </RequiementAccessIndicatorUI>
    )

  if (reqAccessData?.access === null)
    return (
      <RequiementAccessIndicatorUI
        colorScheme={"orange"}
        icon={Warning}
        popoverWidth={"4xs"}
      >
        <PopoverHeader fontWeight={"semibold"} border="0" px="3">
          Couldn't check access
        </PopoverHeader>
      </RequiementAccessIndicatorUI>
    )

  return (
    <RequiementAccessIndicatorUI colorScheme={"gray"} circleBg="gray.500" icon={X}>
      <PopoverHeader fontWeight={"semibold"} border="0" px="3">
        {`Requirement not satisfied with your connected ${
          isPlatform ? "account" : "addresses"
        }`}
      </PopoverHeader>
      {requirement.data.minAmount && (
        <PopoverBody pt="0">{`Expected amount is ${requirement.data.minAmount} but you have ${reqAccessData?.amount}`}</PopoverBody>
      )}
      <PopoverFooter display="flex" justifyContent={"flex-end"} border="0" pt="2">
        <Button size="sm" rightIcon={<Icon as={ArrowSquareIn} />}>
          {`View connected ${isPlatform ? "account" : "addresses"}`}
        </Button>
      </PopoverFooter>
    </RequiementAccessIndicatorUI>
  )
}

export default RequiementAccessIndicator
