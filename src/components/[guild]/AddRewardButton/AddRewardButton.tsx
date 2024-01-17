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
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import useToast from "hooks/useToast"
import { ArrowLeft, Info, Plus } from "phosphor-react"
import SelectRoleOrSetRequirements from "platforms/components/SelectRoleOrSetRequirements"
import platforms from "platforms/platforms"
import { useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { Visibility } from "types"
import getRandomInt from "utils/getRandomInt"
import {
  AddRewardProvider,
  RoleTypeToAddTo,
  useAddRewardContext,
} from "../AddRewardContext"
import { useIsTabsStuck } from "../Tabs/Tabs"
import { useThemeContext } from "../ThemeContext"
import useGuild from "../hooks/useGuild"
import AvailabilitySetup from "./components/AvailabilitySetup"
import useAddReward from "./hooks/useAddReward"

const defaultValues = {
  rolePlatforms: [],
  requirements: [],
  roleIds: [],
  visibility: Visibility.PUBLIC,
}

const AddRewardButton = (): JSX.Element => {
  const { roles } = useGuild()

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

  const methods = useForm({
    defaultValues,
  })

  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

  const goBack = () => {
    if (step === "SELECT_ROLE") {
      setStep("HOME")
      methods.reset(defaultValues)
    } else {
      setSelection(null)
    }
  }

  const requirements = useWatch({ name: "requirements", control: methods.control })
  const roleIds = useWatch({ name: "roleIds", control: methods.control })
  const isAddRewardButtonDisabled =
    activeTab === RoleTypeToAddTo.NEW_ROLE ? !requirements?.length : !roleIds?.length

  const toast = useToast()

  const onCloseAndClear = () => {
    methods.reset(defaultValues)
    onAddRewardModalClose()
  }

  const { onSubmit: onAddRewardSubmit, isLoading: isAddRewardLoading } =
    useAddReward({ onSuccess: onCloseAndClear })
  const { onSubmit: onCreateRoleSubmit, isLoading: isCreateRoleLoading } =
    useCreateRole({
      onSuccess: () => {
        toast({ status: "success", title: "Reward successfully added" })
        onCloseAndClear()
      },
    })

  const isLoading = isAddRewardLoading || isCreateRoleLoading

  const [saveAsDraft, setSaveAsDraft] = useState(false)

  const onSubmit = (data: any, saveAs: "DRAFT" | "PUBLIC" = "PUBLIC") => {
    if (data.requirements?.length > 0) {
      const visibility = saveAs === "DRAFT" ? Visibility.HIDDEN : Visibility.PUBLIC
      onCreateRoleSubmit({
        ...data,
        name: data.name || `New ${platforms[selection].name} role`,
        imageUrl: data.imageUrl || `/guildLogos/${getRandomInt(286)}.svg`,
        visibility,
        rolePlatforms: data.rolePlatforms.map((rp) => ({ ...rp, visibility })),
      })
    } else if (data.roleIds?.length) {
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

  const { AddPlatformPanel, PlatformPreview } = platforms[selection] ?? {}

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
            methods.reset(defaultValues)
            onAddRewardModalClose()
          }}
          size={step === "HOME" ? "4xl" : "2xl"}
          scrollBehavior="inside"
          colorScheme="dark"
        >
          <ModalOverlay />
          <ModalContent minH="550px">
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
                      ? `Add ${platforms[selection].name} reward`
                      : "Add reward"}
                  </Text>
                </HStack>

                {step === "SELECT_ROLE" && (
                  <PlatformPreview>
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
                        /** POAPs will have default startTime and endTime */
                        startTime: rolePlatform?.startTime,
                        endTime: rolePlatform?.endTime,
                      }}
                      onDone={({ capacity, startTime, endTime }) => {
                        methods.setValue(`rolePlatforms.0.capacity`, capacity)
                        methods.setValue(`rolePlatforms.0.startTime`, startTime)
                        methods.setValue(`rolePlatforms.0.endTime`, endTime)
                      }}
                    />
                  </PlatformPreview>
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
                <SelectRoleOrSetRequirements selectedPlatform={selection} />
              ) : AddPlatformPanel ? (
                <AddPlatformPanel
                  onSuccess={() => setStep("SELECT_ROLE")}
                  skipSettings
                />
              ) : (
                <PlatformsGrid onSelection={setSelection} showPoap pb="4" />
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
                          : "The role will be created with hidden visibility, so user's won't see it yet. You can edit & activate it later"
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
    </>
  )
}

const AddRewardButtonWrapper = (): JSX.Element => (
  <AddRewardProvider>
    <AddRewardButton />
  </AddRewardProvider>
)

export default AddRewardButtonWrapper
