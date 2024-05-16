import {
  Flex,
  FormLabel,
  HStack,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import { targetRoleAtom } from "components/[guild]/RoleCard/components/EditRole/EditRole"
import useRequirements from "components/[guild]/hooks/useRequirements"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { useAtomValue } from "jotai"
import { ArrowLeft } from "phosphor-react"
import { useFormContext, useWatch } from "react-hook-form"
import ConversionInput from "../AddTokenPanel/components/ConversionInput"

const ConversionSetup = () => {
  const { control } = useFormContext()
  const requirementId = useWatch({ name: "dynamic.requirementId", control })

  const targetRoleId = useAtomValue<number>(targetRoleAtom)
  const { data: requirements } = useRequirements(targetRoleId)
  const selectedRequirement = requirements.find((req) => req.id === requirementId)

  const baseValueBg = useColorModeValue("blackAlpha.100", "whiteAlpha.100")

  const { setStep } = useAddRewardContext()

  return (
    <>
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
              fromImage={""}
              toImage={""}
            />
          </Stack>
        </Stack>

        <Flex justifyContent={"flex-end"} mt="auto" pt="10">
          <Button colorScheme="green">Continue</Button>
        </Flex>
      </ModalBody>
    </>
  )
}

export default ConversionSetup
