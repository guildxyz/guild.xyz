import {
  Circle,
  Flex,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import useRequirements from "components/[guild]/hooks/useRequirements"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { ArrowLeft, Lightning } from "phosphor-react"
import { useFormContext, useWatch } from "react-hook-form"
import ConversionInput from "../AddTokenPanel/components/ConversionInput"

const ConversionSetup = ({
  onSubmit,
  toImage,
}: {
  onSubmit: () => void
  toImage: JSX.Element
}) => {
  const { control } = useFormContext()
  const requirementId = useWatch({ name: "dynamic.requirementId", control })

  const { targetRoleId } = useAddRewardContext()
  const { data: requirements } = useRequirements(targetRoleId)
  const selectedRequirement = requirements.find((req) => req.id === requirementId)

  const baseValueBg = useColorModeValue("whiteAlpha.800", "whiteAlpha.100")

  const { setStep } = useAddRewardContext()

  const fromImage = (
    <Circle bgColor={"white"} size={5} overflow="hidden">
      <Icon boxSize={3} as={Lightning} weight="fill" color="green.500" />
    </Circle>
  )

  return (
    <ModalContent>
      <ModalCloseButton />
      <ModalHeader pb={4}>
        <Stack spacing={8}>
          <HStack>
            <IconButton
              rounded="full"
              aria-label="Back"
              size="sm"
              mb="-3px"
              icon={<ArrowLeft size={20} />}
              variant="ghost"
              onClick={() => {
                setStep("REWARD_SETUP")
              }}
            />
            <Text>Conversion setup</Text>
          </HStack>
        </Stack>
      </ModalHeader>

      <ModalBody className="custom-scrollbar" display="flex" flexDir="column">
        <Stack gap={5}>
          <Text fontWeight={"semibold"} color={"GrayText"}>
            Set the conversion rate from the dynamic base value provided by the
            selected requirement, to the amount of reward that eligible users will
            receive.
          </Text>

          <Stack gap={1}>
            <FormLabel>Base value</FormLabel>
            <Skeleton isLoaded={!!selectedRequirement}>
              <Card bg={baseValueBg} py={2} px={5}>
                {!!selectedRequirement && (
                  <RequirementDisplayComponent
                    requirement={selectedRequirement}
                    dynamicDisplay
                    rightElement={null}
                  />
                )}
              </Card>
            </Skeleton>
          </Stack>

          <Stack gap={1}>
            <ConversionInput
              name={"dynamic.multiplier"}
              fromImage={fromImage}
              toImage={toImage}
            />
            <Text color={"GrayText"} fontSize={"sm"} textAlign={"right"}>
              The received reward amount will be rounded down
            </Text>
          </Stack>
        </Stack>

        <Flex justifyContent={"flex-end"} mt="auto" pt="10">
          <Button colorScheme="green" onClick={onSubmit}>
            Continue
          </Button>
        </Flex>
      </ModalBody>
    </ModalContent>
  )
}

export default ConversionSetup
