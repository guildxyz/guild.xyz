import {
  Box,
  Circle,
  FormLabel,
  HStack,
  Icon,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { ArrowsClockwise } from "@phosphor-icons/react/ArrowsClockwise"
import { Lightning } from "@phosphor-icons/react/Lightning"
import { useRequirementHandlerContext } from "components/[guild]/RequirementHandlerContext"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import AddCard from "components/common/AddCard"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { useFormContext, useWatch } from "react-hook-form"
import ConversionInput from "../AddTokenPanel/components/ConversionInput"
import BaseValueModal from "./BaseValueModal"

const DynamicRewardSetup = ({
  toImage,
  requirementFieldName,
  multiplierFieldName,
  shouldFloor,
}: {
  toImage: JSX.Element
  fieldName?: string
  requirementFieldName: string
  multiplierFieldName: string
  shouldFloor?: boolean
}) => {
  const { control, setValue } = useFormContext()
  const { requirements } = useRequirementHandlerContext()

  const requirementId = useWatch({ name: requirementFieldName, control })
  const selectedRequirement = requirements?.find((req) => req.id === requirementId)

  const multiplier = useWatch({ name: multiplierFieldName, control })

  const fromImage = (
    <Circle bgColor={"white"} size={5} overflow="hidden">
      <Icon boxSize={3} as={Lightning} weight="fill" color="green.500" />
    </Circle>
  )

  const { onOpen, onClose, isOpen } = useDisclosure()

  return (
    <>
      <Stack gap={4}>
        <Box>
          <HStack justifyContent={"space-between"} w="full" mb="2">
            <FormLabel mb="0">Base value</FormLabel>
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
          </HStack>
          {!!selectedRequirement ? (
            <Card py={2} px={5} boxShadow={"none"} borderWidth={"1px"}>
              <RequirementDisplayComponent
                requirement={selectedRequirement}
                dynamicDisplay
                rightElement={null}
              />
            </Card>
          ) : (
            <AddCard title="Select base value" onClick={onOpen} py="6" />
          )}
        </Box>

        <Box>
          <ConversionInput
            name={multiplierFieldName}
            fromImage={fromImage}
            toImage={toImage}
            defaultMultiplier={multiplier}
          />
          {shouldFloor && (
            <Text mt="1.5" colorScheme={"gray"} fontSize={"sm"} textAlign={"right"}>
              The received reward amount will be rounded down
            </Text>
          )}
        </Box>
      </Stack>

      <BaseValueModal
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
