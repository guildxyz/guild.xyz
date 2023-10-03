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
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import useToast from "hooks/useToast"
import dynamic from "next/dynamic"
import { ArrowLeft, Plus } from "phosphor-react"
import SelectRoleOrSetRequirements from "platforms/components/SelectRoleOrSetRequirements"
import platforms from "platforms/platforms"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { Visibility } from "types"
import getRandomInt from "utils/getRandomInt"
import {
  AddRewardProvider,
  RoleTypeToAddTo,
  useAddRewardContext,
} from "../AddRewardContext"
import { CreatePoapProvider } from "../CreatePoap/components/CreatePoapContext"
import useGuild from "../hooks/useGuild"
import { useIsTabsStuck } from "../Tabs/Tabs"
import { useThemeContext } from "../ThemeContext"
import HiddenRoleAlert from "./components/HiddenRoleAlert"
import useAddReward from "./hooks/useAddReward"

// temporary until POAPs are real rewards
const DynamicAddPoapPanel = dynamic(() => import("components/[guild]/CreatePoap"), {
  ssr: false,
})

const defaultValues = {
  requirements: [],
  visibility: Visibility.PUBLIC,
}

const AddRewardButton = (): JSX.Element => {
  const { account } = useWeb3React()
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
  const isAddRewardButtonDisabled =
    activeTab === RoleTypeToAddTo.NEW_ROLE && !requirements?.length

  const {
    isOpen: isHiddenRoleAlertOpen,
    onOpen: onHiddenRoleAlertOpen,
    onClose: onHiddenRoleAlertClose,
  } = useDisclosure()

  const onClose = () => {
    onAddRewardModalClose()
    onHiddenRoleAlertClose()
  }

  const toast = useToast()

  const { onSubmit: onAddRewardSubmit, isLoading: isAddRewardLoading } =
    useAddReward({ onSuccess: onClose })
  const { onSubmit: onCreateRoleSubmit, isLoading: isCreateRoleLoading } =
    useCreateRole({
      onSuccess: () => {
        toast({ status: "success", title: "Reward successfully added" })
        onClose()
      },
    })

  const isLoading = isAddRewardLoading || isCreateRoleLoading

  const onSubmit = (data: any) => {
    if (data.requirements?.length > 0) {
      onCreateRoleSubmit({
        ...data,
        name: data.name || `New ${platforms[selection].name} role`,
        imageUrl: data.imageUrl || `/guildLogos/${getRandomInt(286)}.svg`,
      })
    } else if (data.roleIds?.length) {
      onAddRewardSubmit({
        ...data.rolePlatforms[0].guildPlatform,
        rolePlatforms: data.roleIds
          ?.filter((roleId) => !!roleId)
          .map((roleId) => ({
            // We'll be able to send additional params here, like capacity & time
            roleId: +roleId,
            visibility: roles.find((role) => role.id === +roleId).visibility,
          })),
      })
    } else {
      onHiddenRoleAlertOpen()
    }
  }

  const onSubmitWithHiddenRole = (data: any) =>
    onCreateRoleSubmit({
      ...data,
      name: data.name || `New ${platforms[selection].name} role`,
      imageUrl: data.imageUrl || `/guildLogos/${getRandomInt(286)}.svg`,
      visibility: Visibility.HIDDEN,
      requirements: [
        {
          type: "ALLOWLIST",
          data: {
            addresses: [account.toLowerCase()],
          },
        },
      ],
    })

  const { AddPlatformPanel, PlatformPreview } = platforms[selection] ?? {}

  const lightModalBgColor = useColorModeValue("white", "gray.700")

  const { isBackButtonDisabled } = useAddRewardContext()

  return (
    <>
      <Button
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
            onClose()
          }}
          size={step === "HOME" ? "4xl" : "2xl"}
          scrollBehavior="inside"
          colorScheme="dark"
        >
          <ModalOverlay />
          {/* TODO: this is a temporary solution, we should remove this from here when POAPs become real rewards */}
          <CreatePoapProvider>
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

                  {step === "SELECT_ROLE" && <PlatformPreview />}
                </Stack>
              </ModalHeader>

              <ModalBody ref={modalRef} className="custom-scrollbar">
                {selection === "POAP" ? (
                  <DynamicAddPoapPanel />
                ) : selection && step === "SELECT_ROLE" ? (
                  <SelectRoleOrSetRequirements selectedPlatform={selection} />
                ) : AddPlatformPanel ? (
                  <AddPlatformPanel
                    onSuccess={() => setStep("SELECT_ROLE")}
                    skipSettings
                  />
                ) : (
                  <PlatformsGrid onSelection={setSelection} showPoap />
                )}
              </ModalBody>

              {selection !== "POAP" && step === "SELECT_ROLE" && (
                <ModalFooter pt="6" pb="8">
                  <Button
                    isDisabled={isAddRewardButtonDisabled}
                    colorScheme="green"
                    onClick={methods.handleSubmit(onSubmit)}
                    isLoading={isLoading}
                  >
                    Done
                  </Button>
                </ModalFooter>
              )}
            </ModalContent>
          </CreatePoapProvider>
        </Modal>

        <HiddenRoleAlert
          isOpen={isHiddenRoleAlertOpen}
          onClose={onHiddenRoleAlertClose}
          onAccept={methods.handleSubmit(onSubmitWithHiddenRole)}
          isCreateRoleLoading={isCreateRoleLoading}
        />
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
