import {
  Circle,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tag,
} from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import useAccess from "components/[guild]/hooks/useAccess"
import { Check, Warning, X } from "phosphor-react"
import REQUIREMENTS from "requirements"
import Requirement from "requirements/common/Requirement"
import { Requirement as RequirementType } from "types"

type Props = {
  requirement: RequirementType
  roleId: number
}

const RequirementDisplayComponent = ({ requirement, roleId }: Props) => {
  const RequirementComponent = REQUIREMENTS[requirement.type]?.displayComponent
  const { data } = useAccess(roleId)
  const gateReq = data?.requirements?.find(
    (obj) => obj.requirementId === requirement.id
  )

  if (!RequirementComponent)
    return (
      <Requirement image={<Icon as={Warning} boxSize={5} color="orange.300" />}>
        {`Unsupported requirement type: `}
        <DataBlock>{requirement.type}</DataBlock>
      </Requirement>
    )

  return (
    <RequirementComponent
      requirement={requirement}
      rightElement={
        data && (
          <Popover placement="left" trigger="hover">
            <PopoverTrigger>
              <Circle
                bg={gateReq?.access ? "green.300" : "gray.500"}
                size={2}
                transition="transform .2s"
                _hover={{ transform: "scale(1.5)" }}
              />
            </PopoverTrigger>
            <PopoverContent width={gateReq?.access && "2xs"}>
              {gateReq?.access ? (
                <PopoverHeader fontWeight={"semibold"} border="0" px="3">
                  <Tag colorScheme="green" mr="2.5">
                    <Check />
                  </Tag>
                  Requirement satisfied
                </PopoverHeader>
              ) : (
                <>
                  <PopoverHeader fontWeight={"semibold"} border="0" px="3">
                    <Tag colorScheme="gray" mr="2.5">
                      <X />
                    </Tag>
                    Requirement not satisfied
                  </PopoverHeader>
                  {requirement.data.minAmount && (
                    <PopoverBody>{`Expected amount is ${requirement.data.minAmount} but you have ${gateReq?.amount}`}</PopoverBody>
                  )}
                </>
              )}
              <PopoverArrow />
            </PopoverContent>
          </Popover>
        )
      }
    />
  )
}

export default RequirementDisplayComponent
