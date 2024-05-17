import { ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { atom, useAtomValue } from "jotai"
import { Plus } from "phosphor-react"
import rewards from "platforms/rewards"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformType, Requirement, RoleFormType, Visibility } from "types"
import getRandomInt from "utils/getRandomInt"
import { AddRewardProvider, useAddRewardContext } from "../AddRewardContext"
import LoadingModal from "../RolePlatforms/components/AddRoleRewardModal/LoadingModal"
import SelectRewardPanel from "../RolePlatforms/components/AddRoleRewardModal/SelectRewardPanel"
import { useIsTabsStuck } from "../Tabs"
import { useThemeContext } from "../ThemeContext"
import useGuild from "../hooks/useGuild"
import SelectRolePanel from "./SelectRolePanel"
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

export const defaultValues: AddRewardForm = {
  rolePlatforms: [],
  requirements: [],
  roleIds: [],
  visibility: Visibility.PUBLIC,
}

export const canCloseAddRewardModalAtom = atom(true)

const AddRewardButton = (): JSX.Element => {
  const { captureEvent } = usePostHogContext()
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
    selection,
    step,
    setStep,
    isOpen,
    onOpen,
    onClose: onAddRewardModalClose,
  } = useAddRewardContext()

  const methods = useForm<AddRewardForm>({
    defaultValues,
  })

  const visibility = useWatch({ name: "visibility", control: methods.control })

  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

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

  const { AddRewardPanel } = rewards[selection] ?? {}
  const showErrorToast = useShowErrorToast()

  const isRewardSetupStep = selection && step !== "HOME" && step !== "SELECT_ROLE"

  const handleClose = () => {
    if (!canClose) {
      showErrorToast("You can't close the modal until the transaction finishes")
      return
    }
    if (isAddRewardPanelDirty) onDiscardAlertOpen()
    else {
      methods.reset(defaultValues)
      onAddRewardModalClose()
    }
  }

  const isLoading = isAddRewardLoading || isCreateRoleLoading || erc20Loading

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
          onClose={handleClose}
          size={step === "SELECT_ROLE" ? "2xl" : "4xl"}
          scrollBehavior="inside"
          colorScheme="dark"
        >
          <ModalOverlay />
          <ModalContent>
            {step === "SELECT_ROLE" && <SelectRolePanel onSubmit={onSubmit} />}
            {step === "HOME" && <SelectRewardPanel />}

            {isRewardSetupStep && (
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

      <LoadingModal isOpen={isLoading}>
        <Text fontWeight={"semibold"}>Creating reward...</Text>
      </LoadingModal>
    </>
  )
}

const AddRewardButtonWrapper = (): JSX.Element => (
  <AddRewardProvider>
    <AddRewardButton />
  </AddRewardProvider>
)

export default AddRewardButtonWrapper
