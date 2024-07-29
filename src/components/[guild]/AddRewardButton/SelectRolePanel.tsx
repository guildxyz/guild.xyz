import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import {
  HStack,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { Visibility } from "@guildxyz/types"
import { ArrowLeft, Info } from "@phosphor-icons/react"
import Button from "components/common/Button"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useCreateRRR, { SubmitData } from "hooks/useCreateRRR"
import useToast from "hooks/useToast"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import rewards, { CAPACITY_TIME_PLATFORMS } from "rewards"
import { RewardPreviews } from "rewards/RewardPreviews"
import SelectRoleOrSetRequirements from "rewards/components/SelectRoleOrSetRequirements"
import { RoleTypeToAddTo, useAddRewardContext } from "../AddRewardContext"
import useGuild from "../hooks/useGuild"
import AvailabilitySetup from "./components/AvailabilitySetup"
import { ADD_REWARD_FORM_DEFAULT_VALUES } from "./constants"

const SelectRolePanel = ({
  onSuccess,
}: {
  onSuccess?: Parameters<typeof useCreateRRR>[0]["onSuccess"]
}) => {
  const { modalRef, selection, activeTab, setStep, isBackButtonDisabled } =
    useAddRewardContext()

  const { urlName } = useGuild()
  const { captureEvent } = usePostHogContext()

  const lightModalBgColor = useColorModeValue("white", "gray.700")

  const methods = useFormContext()
  const rolePlatform = methods.getValues("rolePlatforms.0")

  const requirements = useWatch({ name: "requirements", control: methods.control })
  const roleIds = useWatch({ name: "roleIds", control: methods.control })

  const postHogOptions = {
    guild: urlName,
    type: activeTab,
    requirements: requirements,
    roleIds: roleIds,
  }
  const toast = useToast()
  const triggerConfetti = useJsConfetti()

  const { onSubmit, isLoading } = useCreateRRR({
    onSuccess: (res) => {
      triggerConfetti()
      toast({
        title: "Reward successfully created!",
        status: "success",
      })
      captureEvent("reward created (AddRewardButton)", postHogOptions)
      onSuccess?.(res)
    },
  })

  const [saveAsDraft, setSaveAsDraft] = useState(false)

  const isAddRewardButtonDisabled =
    activeTab === RoleTypeToAddTo.NEW_ROLE ? !requirements?.length : !roleIds?.length

  const RewardPreview = RewardPreviews.hasOwnProperty(selection)
    ? RewardPreviews[selection as keyof typeof RewardPreviews]
    : null

  const goBack = () => {
    if (!rewards[selection].autoRewardSetup)
      methods.reset(ADD_REWARD_FORM_DEFAULT_VALUES)
    setStep(selection === "POLYGON_ID" ? "HOME" : "REWARD_SETUP")
  }

  return (
    <ModalContent>
      <ModalCloseButton />
      <ModalHeader bgColor={lightModalBgColor} boxShadow={"sm"} zIndex={1}>
        <Stack spacing={8}>
          <HStack>
            <IconButton
              isDisabled={isBackButtonDisabled}
              rounded="full"
              aria-label="Back"
              size="sm"
              mb="-3px"
              icon={<ArrowLeft size={20} />}
              variant="ghost"
              onClick={goBack}
            />
            <Text>{`Add ${rewards[selection]?.name} reward`}</Text>
          </HStack>

          {RewardPreview && (
            <RewardPreview>
              {CAPACITY_TIME_PLATFORMS.includes(selection) && (
                <AvailabilitySetup
                  platformType={rolePlatform?.guildPlatform?.platformName}
                  rolePlatform={rolePlatform}
                  defaultValues={{
                    /**
                     * If the user doesn't upload mint links for a POAP, we should
                     * fallback to undefined, since 0 is not a valid value here
                     */
                    capacity:
                      rolePlatform?.guildPlatform?.platformGuildData?.texts
                        ?.length || undefined,
                    /** POAPs have default startTime and endTime */
                    startTime: rolePlatform?.startTime,
                    endTime: rolePlatform?.endTime,
                  }}
                  onDone={({ capacity, startTime, endTime }) => {
                    methods.setValue(`rolePlatforms.0.capacity`, capacity)
                    methods.setValue(`rolePlatforms.0.startTime`, startTime)
                    methods.setValue(`rolePlatforms.0.endTime`, endTime)
                  }}
                />
              )}
            </RewardPreview>
          )}
        </Stack>
      </ModalHeader>

      <ModalBody
        ref={modalRef}
        className="custom-scrollbar"
        display="flex"
        flexDir="column"
      >
        <SelectRoleOrSetRequirements selectedPlatform={selection} />
      </ModalBody>

      <ModalFooter pt="6" pb="8" gap={2}>
        <Button
          isDisabled={isAddRewardButtonDisabled}
          onClick={methods.handleSubmit((data) => {
            setSaveAsDraft(true)
            const draftData = changeDataToDraft(data as SubmitData)
            onSubmit(draftData)
          })}
          isLoading={saveAsDraft && isLoading}
          rightIcon={
            <Tooltip
              label={
                activeTab === RoleTypeToAddTo.EXISTING_ROLE
                  ? "The reward will be added to the role you select with hidden visibility, so users won't see it yet. You can edit & activate it later"
                  : "The role will be created with hidden visibility, so users won't see it yet. You can edit & activate it later"
              }
            >
              <Info />
            </Tooltip>
          }
        >
          Save as draft
        </Button>
        <Button
          isDisabled={isAddRewardButtonDisabled}
          colorScheme="green"
          onClick={methods.handleSubmit(onSubmit)}
          isLoading={!saveAsDraft && isLoading}
        >
          Save
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}

const changeDataToDraft = (data: SubmitData): SubmitData => {
  if (!data.roleIds?.length) {
    return { ...data, visibility: "HIDDEN" as Visibility }
  }

  const { rolePlatforms, requirements, roleIds } = data

  const hiddenRolePlatforms = rolePlatforms.map((rp) => ({
    ...rp,
    visibility: "HIDDEN" as Visibility,
  }))
  const hiddenRequirements = requirements.map((req) =>
    req.type === "FREE" ? req : { ...req, visibility: "HIDDEN" as Visibility }
  )

  return {
    rolePlatforms: hiddenRolePlatforms,
    requirements: hiddenRequirements,
    roleIds,
  }
}

export default SelectRolePanel
