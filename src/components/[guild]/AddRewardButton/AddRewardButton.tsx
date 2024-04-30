import {
  HStack,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { atom, useAtomValue } from "jotai"
import { ArrowLeft, Info, Plus } from "phosphor-react"
import SelectRoleOrSetRequirements from "platforms/components/SelectRoleOrSetRequirements"
import rewards, { modalSizeForPlatform } from "platforms/rewards"
import { useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformType, Requirement, RoleFormType, Visibility } from "types"
import getRandomInt from "utils/getRandomInt"
import {
  AddRewardProvider,
  RoleTypeToAddTo,
  useAddRewardContext,
} from "../AddRewardContext"
import { useIsTabsStuck } from "../Tabs"
import { useThemeContext } from "../ThemeContext"
import useGuild from "../hooks/useGuild"
import AvailabilitySetup from "./components/AvailabilitySetup"
import useAddReward from "./hooks/useAddReward"
import { useAddRewardDiscardAlert } from "./hooks/useAddRewardDiscardAlert"
import useCreateReqBasedTokenReward from "./useCreateTokenReward"

export type AddRewardForm = {
  // TODO: we could simplify the form - we don't need a rolePlatforms array here, we only need one rolePlatform
  rolePlatforms: RoleFormType["rolePlatforms"][number][]
  requirements?: Requirement[]
  roleIds?: number[]
  visibility: Visibility
}

const defaultValues: AddRewardForm = {
  rolePlatforms: [],
  requirements: [],
  roleIds: [],
  visibility: Visibility.PUBLIC,
}

export const canCloseAddRewardModalAtom = atom(true)

const AddRewardButton = (): JSX.Element => {
  const { captureEvent, startSessionRecording } = usePostHogContext()
  const { roles } = useGuild()
  const [isAddRewardPanelDirty, setIsAddRewardPanelDirty] =
    useAddRewardDiscardAlert()
  const {
    isOpen: isDiscardAlertOpen,
    onOpen: onDiscardAlertOpen,
    onClose: onDiscardAlertClose,
  } = useDisclosure()

  const canClose = useAtomValue(canCloseAddRewardModalAtom)

  const {
    modalRef,
    selection,
    setSelection,
    step,
    setStep,
    activeTab,

    isOpen,
    onOpen,
    onClose: onAddRewardModalClose,
    isBackButtonDisabled,
  } = useAddRewardContext()

  const methods = useForm<AddRewardForm>({
    defaultValues,
  })

  const visibility = useWatch({ name: "visibility", control: methods.control })

  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

  const goBack = () => {
    setIsAddRewardPanelDirty(false)
    if (step === "SELECT_ROLE" && !rewards[selection].autoRewardSetup) {
      methods.reset(defaultValues)
    } else {
      setSelection(null)
    }
    setStep("HOME")
  }

  const requirements = useWatch({ name: "requirements", control: methods.control })
  const roleIds = useWatch({ name: "roleIds", control: methods.control })

  const isRoleSelectorDisabled = selection === "ERC20"
  const isAddRewardButtonDisabled =
    activeTab === RoleTypeToAddTo.NEW_ROLE || isRoleSelectorDisabled
      ? !requirements?.length
      : !roleIds?.length

  const toast = useToast()

  const onCloseAndClear = () => {
    methods.reset(defaultValues)
    onAddRewardModalClose()
    setIsAddRewardPanelDirty(false)
  }

  const { onSubmit: onAddRewardSubmit, isLoading: isAddRewardLoading } =
    useAddReward({
      onSuccess: () => {
        captureEvent("[discord setup] successfully added to existing guild")
        onCloseAndClear()
      },
      onError: (err) => {
        captureEvent("[discord setup] failed to add to existing guild", {
          error: err,
        })
      },
    })
  const { onSubmit: onCreateRoleSubmit, isLoading: isCreateRoleLoading } =
    useCreateRole({
      onSuccess: () => {
        toast({ status: "success", title: "Reward successfully added" })
        onCloseAndClear()
      },
    })

  const [saveAsDraft, setSaveAsDraft] = useState(false)

  const isERC20 = (data) =>
    data.rolePlatforms[0].guildPlatform.platformId === PlatformType.ERC20

  const { submitCreate: submitCreateReqBased, isLoading: erc20Loading } =
    useCreateReqBasedTokenReward({
      onSuccess: () => {
        toast({ status: "success", title: "Reward successfully added" })
        onCloseAndClear()
      },
      onError: (err) => console.error(err),
    })

  const isLoading = isAddRewardLoading || isCreateRoleLoading || erc20Loading

  const submitERC20Reward = async (
    data: any,
    saveAs: "DRAFT" | "PUBLIC" = "PUBLIC"
  ) => {
    const isRequirementBased =
      data.rolePlatforms[0].dynamicAmount.operation.input.type ===
      "REQUIREMENT_AMOUNT"

    const guildPlatformExists = !!data.rolePlatforms[0].guildPlatformId

    if (isRequirementBased) {
      submitCreateReqBased(data, saveAs)
      return
    } else {
      /** TODO: Write when static reward is needed */
      if (guildPlatformExists) {
        data.rolePlatforms[0].guildPlatform = {
          platformId: PlatformType.ERC20,
          platformName: "ERC20",
          platformGuildId: "",
          platformGuildData: {},
        }
      }
      return
    }
  }

  const onSubmit = async (data: any, saveAs: "DRAFT" | "PUBLIC" = "PUBLIC") => {
    if (isERC20(data)) return submitERC20Reward(data, saveAs)

    if (data.requirements?.length > 0) {
      const roleVisibility =
        saveAs === "DRAFT" ? Visibility.HIDDEN : Visibility.PUBLIC
      onCreateRoleSubmit({
        ...data,
        name: data.name || `New ${rewards[selection].name} role`,
        imageUrl: data.imageUrl || `/guildLogos/${getRandomInt(286)}.svg`,
        roleVisibility,
        rolePlatforms: data.rolePlatforms.map((rp) => ({
          ...rp,
          visibility: roleVisibility,
        })),
      })
    } else {
      onAddRewardSubmit({
        ...data.rolePlatforms[0].guildPlatform,
        rolePlatforms: data.roleIds
          ?.filter((roleId) => !!roleId)
          .map((roleId) => ({
            // We'll be able to send additional params here, like capacity & time
            roleId: +roleId,
            /**
             * Temporary for POINTS rewards, because they can be added to multiple
             * roles and this field has a unique constraint in the DB
             */
            platformRoleId: roleId,
            ...data.rolePlatforms[0],
            visibility:
              saveAs === "DRAFT"
                ? Visibility.HIDDEN
                : roles.find((role) => role.id === +roleId).visibility,
          })),
      })
    }
  }

  const { AddRewardPanel, RewardPreview } = rewards[selection] ?? {}
  const showErrorToast = useShowErrorToast()
  const lightModalBgColor = useColorModeValue("white", "gray.700")
  const rolePlatform = methods.getValues("rolePlatforms.0")

  return (
    <>
      <Button
        data-test="add-reward-button"
        leftIcon={<Plus />}
        onClick={onOpen}
        variant="ghost"
        size="sm"
        {...(!isStuck && {
          color: textColor,
          colorScheme: buttonColorScheme,
        })}
      >
        Add reward
      </Button>

      <FormProvider {...methods}>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            if (!canClose) {
              showErrorToast(
                "You can't close the modal until the transaction finishes"
              )
              return
            }
            if (isAddRewardPanelDirty) onDiscardAlertOpen()
            else {
              methods.reset(defaultValues)
              onAddRewardModalClose()
            }
          }}
          size={step === "HOME" ? modalSizeForPlatform(selection) : "2xl"}
          scrollBehavior="inside"
          colorScheme="dark"
        >
          <ModalOverlay />
          <ModalContent minH={selection !== "ERC20" && "550px"}>
            <ModalCloseButton />
            <ModalHeader
              {...(step === "SELECT_ROLE"
                ? {
                    bgColor: lightModalBgColor,
                    boxShadow: "sm",
                    zIndex: 1,
                  }
                : {})}
            >
              <Stack spacing={8}>
                <HStack>
                  {selection && (
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
                  )}
                  <Text>
                    {selection
                      ? `Add ${rewards[selection].name} reward`
                      : "Add reward"}
                  </Text>
                </HStack>

                {step === "SELECT_ROLE" && (
                  <RewardPreview>
                    <AvailabilitySetup
                      platformType={rolePlatform?.guildPlatform?.platformName}
                      rolePlatform={rolePlatform}
                      defaultValues={{
                        /**
                         * If the user doesn't upload mint links for a POAP, we
                         * should fallback to undefined, since 0 is not a valid value
                         * here
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
              {selection && step === "SELECT_ROLE" ? (
                <SelectRoleOrSetRequirements
                  selectedPlatform={selection}
                  isRoleSelectorDisabled={isRoleSelectorDisabled}
                />
              ) : AddRewardPanel ? (
                <AddRewardPanel
                  onAdd={(createdRolePlatform) => {
                    methods.setValue("rolePlatforms.0", {
                      ...createdRolePlatform,
                      visibility,
                    })
                    if (createdRolePlatform?.requirements?.length > 0) {
                      methods.setValue(
                        "requirements",
                        createdRolePlatform.requirements
                      )
                    }
                    setStep("SELECT_ROLE")
                  }}
                  skipSettings
                />
              ) : (
                <PlatformsGrid
                  onSelection={(selected) => {
                    // Should we add sampling here? Or is it sampled by default?
                    startSessionRecording()
                    captureEvent("[discord setup] started in existing guild")
                    setSelection(selected)
                  }}
                  pb="4"
                />
              )}
            </ModalBody>

            {step === "SELECT_ROLE" && (
              <ModalFooter pt="6" pb="8" gap={2}>
                <Button
                  isDisabled={isAddRewardButtonDisabled}
                  onClick={methods.handleSubmit((data) => {
                    setSaveAsDraft(true)
                    onSubmit(data, "DRAFT")
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
                  onClick={methods.handleSubmit((data) => {
                    setSaveAsDraft(false)
                    onSubmit(data)
                  })}
                  isLoading={!saveAsDraft && isLoading}
                >
                  Save
                </Button>
              </ModalFooter>
            )}
          </ModalContent>
        </Modal>
      </FormProvider>
      <DiscardAlert
        isOpen={isDiscardAlertOpen}
        onClose={onDiscardAlertClose}
        onDiscard={() => {
          onAddRewardModalClose()
          onDiscardAlertClose()
          setIsAddRewardPanelDirty(false)
        }}
      />
    </>
  )
}

const AddRewardButtonWrapper = (): JSX.Element => (
  <AddRewardProvider>
    <AddRewardButton />
  </AddRewardProvider>
)

export default AddRewardButtonWrapper
