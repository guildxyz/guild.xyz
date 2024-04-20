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
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import { SectionTitle } from "components/common/Section"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import RequirementBaseCard from "components/create-guild/Requirements/components/RequirementBaseCard"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { atom, useAtomValue } from "jotai"
import { ArrowLeft, Info, Plus } from "phosphor-react"
import SelectRoleOrSetRequirements from "platforms/components/SelectRoleOrSetRequirements"
import rewards from "platforms/rewards"
import { useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import AirdropRequirement from "requirements/Airdrop/AirdropRequirement"
import {
  PlatformName,
  PlatformType,
  Requirement,
  RoleFormType,
  Visibility,
} from "types"
import getRandomInt from "utils/getRandomInt"
import {
  AddRewardProvider,
  RoleTypeToAddTo,
  useAddRewardContext,
} from "../AddRewardContext"
import { RequirementProvider } from "../Requirements/components/RequirementContext"
import { useIsTabsStuck } from "../Tabs"
import { useThemeContext } from "../ThemeContext"
import useGuild from "../hooks/useGuild"
import AvailabilitySetup from "./components/AvailabilitySetup"
import useAddReward from "./hooks/useAddReward"
import { useAddRewardDiscardAlert } from "./hooks/useAddRewardDiscardAlert"

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
  const isAddRewardButtonDisabled =
    activeTab === RoleTypeToAddTo.NEW_ROLE ? !requirements?.length : !roleIds?.length

  const toast = useToast()

  const onCloseAndClear = () => {
    methods.reset(defaultValues)
    onAddRewardModalClose()
    setIsAddRewardPanelDirty(false)
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

  const isERC20 = (data) => {
    if (
      !!data.rolePlatforms[0].guildPlatformId &&
      data.rolePlatforms[0].guildPlatform.platformId === PlatformType.ERC20
    )
      return "EXISTING_GP"
    if (data.rolePlatforms[0].guildPlatform.platformId === PlatformType.ERC20)
      return "NEW_GP"
    return null
  }

  const onSubmit = async (data: any, saveAs: "DRAFT" | "PUBLIC" = "PUBLIC") => {
    const tokenReward = isERC20(data)

    if (tokenReward) {
      /**
       * ERC20 rewards always create a new role.
       *
       * 1. Create role with the snapshot requirement
       * 2. Add the reward, where the dynamicAmount should reference the new role and
       *    snapshot requirement
       */

      const roleVisibility =
        saveAs === "DRAFT" ? Visibility.HIDDEN : Visibility.PUBLIC

      const createdRole = await onCreateRoleSubmit({
        ...data,
        name:
          data.name ||
          `${data.rolePlatforms[0].guildPlatform.platformGuildData.name} role`,
        imageUrl:
          data.rolePlatforms[0].guildPlatform.platformGuildData?.imageUrl ||
          `/guildLogos/${getRandomInt(286)}.svg`,
        roleVisibility,
        rolePlatforms: [], // Empty, we create it later with the roleId and reqId
      })

      if (tokenReward === "EXISTING_GP") {
        data.rolePlatforms[0].guildPlatform = {
          platformId: PlatformType.ERC20,
          platformName: "ERC20",
          platformGuildId: "",
          platformGuildData: {},
        }
      }

      await onAddRewardSubmit({
        ...data.rolePlatforms[0].guildPlatform,
        rolePlatforms: [
          {
            // We'll be able to send additional params here, like capacity & time
            roleId: createdRole.id,
            /**
             * Temporary for POINTS rewards, because they can be added to multiple
             * roles and this field has a unique constraint in the DB
             */
            ...(tokenReward === "EXISTING_GP" && {
              guildPlatformId: data.rolePlatforms[0].guildPlatformId,
            }),
            platformRoleId:
              data.rolePlatforms[0].guildPlatform.platformGuildId ||
              `${createdRole.id}-${Date.now()}`,
            guildPlatform: data.rolePlatforms[0].guildPlatform,
            isNew: data.rolePlatforms[0].isNew,
            visibility: saveAs === "DRAFT" ? Visibility.HIDDEN : Visibility.PUBLIC,
            dynamicAmount: {
              operation: {
                type: data.rolePlatforms[0].dynamicAmount.operation.type,
                params: data.rolePlatforms[0].dynamicAmount.operation.params,
                input: {
                  type: "REQUIREMENT_AMOUNT",
                  roleId: createdRole.id,
                  requirementId: createdRole.requirements[0].id,
                },
              },
            },
          },
        ],
      })

      // const createdReward = await onAddRewardSubmit({
      //   ...data.rolePlatforms[0].guildPlatform,
      //   rolePlatforms: [
      //     {
      //       roleId: createdRole.id,
      //       platformRoleId: data.rolePlatforms[0].guildPlatform.platformGuildId,
      //       ...(tokenReward === "EXISTING_GP" && { guildPlatformId: data.rolePlatforms[0].guildPlatformId }),
      //       guildPlatform: data.rolePlatforms[0].guildPlatform,
      //       isNew: data.rolePlatforms[0].isNew,
      //       dynamicAmount: {
      //         operation: {
      //           type: data.rolePlatforms[0].dynamicAmount.operation.type,
      //           params: data.rolePlatforms[0].dynamicAmount.operation.params,
      //           input: {
      //             type: "REQUIREMENT_AMOUNT",
      //             roleId: createdRole.id,
      //             requirementId: createdRole.requirements[0].id,
      //           },
      //         },
      //       },
      //       visibility: saveAs === "DRAFT" ? Visibility.HIDDEN : Visibility.PUBLIC,
      //     },
      //   ],
      // })

      return
    }

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

  const platformSize = (platform: PlatformName) => {
    switch (platform) {
      case "ERC20":
        return "xl"
      default:
        return "4xl"
    }
  }

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
          size={step === "HOME" ? platformSize(selection) : "2xl"}
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
                <>
                  {selection !== "ERC20" ? (
                    <>
                      <SectionTitle
                        mt={6}
                        mb={1}
                        title={"Role information"}
                      ></SectionTitle>
                      <Text color={"GrayText"} mb={5}>
                        A new role will be created for the token reward, with the
                        following snapshot requirement, matching your previous
                        snapshot selection.
                      </Text>
                      <RequirementBaseCard>
                        {/*  TODO: Change to the snapshot req */}
                        <RequirementProvider
                          requirement={{
                            id: 0,
                            type: "GUILD_SNAPSHOT",
                            roleId: 0,
                            name: null,
                            symbol: null,
                            data: {
                              snapshot: [{ key: "asdasd", value: 1 }],
                            },
                          }}
                        >
                          <AirdropRequirement />
                        </RequirementProvider>
                      </RequirementBaseCard>
                    </>
                  ) : (
                    <SelectRoleOrSetRequirements selectedPlatform={selection} />
                  )}
                </>
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
                <PlatformsGrid onSelection={setSelection} pb="4" />
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
