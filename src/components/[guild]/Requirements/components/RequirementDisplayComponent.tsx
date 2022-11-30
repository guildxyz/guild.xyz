import {
  Circle,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import DataBlock from "components/common/DataBlock"
import useAccess from "components/[guild]/hooks/useAccess"
import { ArrowSquareIn, Check, Warning, X } from "phosphor-react"
import REQUIREMENTS from "requirements"
import Requirement from "requirements/common/Requirement"
import { Requirement as RequirementType } from "types"

type Props = {
  requirement: RequirementType
  roleId: number
}

const HOVER_STYLES = {
  bg: "unset",
  width: 7,
  height: 7,
  borderRadius: 0,
  "> *": {
    opacity: 1,
  },
}

const RequirementDisplayComponent = ({ requirement, roleId }: Props) => {
  const reqObj = REQUIREMENTS[requirement.type]
  const RequirementComponent = reqObj?.displayComponent
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
          <Popover placement="left" trigger="hover" closeDelay={100} openDelay={200}>
            {({ isOpen, onClose }) => (
              <>
                <PopoverTrigger>
                  <Circle
                    bg={
                      gateReq?.access
                        ? "green.300"
                        : gateReq?.access === null
                        ? "orange.300"
                        : "gray.500"
                    }
                    size={2}
                    transition="all .2s"
                    overflow={"hidden"}
                    pos="relative"
                    fontSize={"md"}
                    sx={{
                      "> *": {
                        opacity: 0,
                        transition: "opacity .2s",
                      },
                      ...(isOpen ? HOVER_STYLES : {}),
                    }}
                    _hover={HOVER_STYLES}
                  >
                    {gateReq?.access ? (
                      <Tag colorScheme="green" pos="absolute" px="1.5" py="1.5">
                        <Icon as={Check} />
                      </Tag>
                    ) : gateReq?.access === null ? (
                      <Tag colorScheme="orange" pos="absolute" px="1.5" py="1.5">
                        <Icon as={Warning} />
                      </Tag>
                    ) : (
                      <Tag colorScheme="gray" pos="absolute" px="1.5" py="1.5">
                        <Icon as={X} />
                      </Tag>
                    )}
                  </Circle>
                </PopoverTrigger>
                <PopoverContent
                  width={gateReq?.access !== false ? "4xs" : undefined}
                >
                  {gateReq?.access ? (
                    <PopoverHeader fontWeight={"semibold"} border="0" px="3">
                      <Text as="span" mr="2">
                        🎉
                      </Text>
                      Requirement satisfied
                    </PopoverHeader>
                  ) : gateReq?.access === null ? (
                    <PopoverHeader fontWeight={"semibold"} border="0" px="3">
                      Couldn't check access
                    </PopoverHeader>
                  ) : (
                    <>
                      <PopoverHeader fontWeight={"semibold"} border="0" px="3">
                        {`Requirement not satisfied with your connected ${
                          reqObj.isPlatform ? "account" : "addresses"
                        }`}
                      </PopoverHeader>
                      {requirement.data.minAmount && (
                        <PopoverBody pt="0">{`Expected amount is ${requirement.data.minAmount} but you have ${gateReq?.amount}`}</PopoverBody>
                      )}
                      <PopoverFooter
                        display="flex"
                        justifyContent={"flex-end"}
                        border="0"
                        pt="2"
                      >
                        <Button size="sm" rightIcon={<Icon as={ArrowSquareIn} />}>
                          {`View connected ${
                            reqObj.isPlatform ? "account" : "addresses"
                          }`}
                        </Button>
                      </PopoverFooter>
                    </>
                  )}
                  <PopoverArrow />
                </PopoverContent>
              </>
            )}
          </Popover>
        )
      }
    />
  )
}

export default RequirementDisplayComponent
