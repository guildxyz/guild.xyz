import {
  Circle,
  Flex,
  FormLabel,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import useRequirements from "components/[guild]/hooks/useRequirements"
import AddCard from "components/common/AddCard"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { ArrowsClockwise, Lightning } from "phosphor-react"
import { useFormContext, useWatch } from "react-hook-form"
import ConversionInput from "../AddTokenPanel/components/ConversionInput"
import BaseValueModal from "./BaseValueModal"

const DynamicRewardSetup = ({
  toImage,
  roleId,
  requirementFieldName,
  multiplierFieldName,
}: {
  toImage: JSX.Element
  fieldName?: string
  roleId: number
  requirementFieldName: string
  multiplierFieldName
}) => {
  const { control, setValue } = useFormContext()

  const requirementId = useWatch({ name: requirementFieldName, control })

  const { data: requirements } = useRequirements(roleId)
  const selectedRequirement = requirements?.find((req) => req.id === requirementId)

  const baseValueBg = useColorModeValue("whiteAlpha.800", "whiteAlpha.100")
  const multiplier = useWatch({ name: multiplierFieldName, control })

  const fromImage = (
    <Circle bgColor={"white"} size={5} overflow="hidden">
      <Icon boxSize={3} as={Lightning} weight="fill" color="green.500" />
    </Circle>
  )

  const { onOpen, onClose, isOpen } = useDisclosure()

  return (
    <>
      <Stack gap={5}>
        <Stack gap={1}>
          <Flex justifyContent={"space-between"} w="full">
            <FormLabel>Base value</FormLabel>
            {!!selectedRequirement && (
              <Button
                size="xs"
                variant="ghost"
                borderRadius={"lg"}
                leftIcon={<ArrowsClockwise />}
                onClick={onOpen}
                color="GrayText"
              >
                <Text>Change</Text>
              </Button>
            )}
          </Flex>
          {!!selectedRequirement ? (
            <Card bg={baseValueBg} py={2} px={5}>
              <RequirementDisplayComponent
                requirement={selectedRequirement}
                dynamicDisplay
                rightElement={null}
              />
            </Card>
          ) : (
            <AddCard title="Select base value" onClick={onOpen} />
          )}
        </Stack>

        <Stack gap={1}>
          <ConversionInput
            name={multiplierFieldName}
            fromImage={fromImage}
            toImage={toImage}
            defaultMultiplier={multiplier}
          />
          <Text color={"GrayText"} fontSize={"sm"} textAlign={"right"}>
            The received reward amount will be rounded down
          </Text>
        </Stack>
      </Stack>

      <BaseValueModal
        roleId={roleId}
        onClose={onClose}
        isOpen={isOpen}
        onSelect={(reqId) => {
          setValue(requirementFieldName, reqId)
          onClose()
        }}
      />
    </>
  )
}

export default DynamicRewardSetup
