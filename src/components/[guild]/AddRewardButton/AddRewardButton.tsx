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
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import dynamic from "next/dynamic"
import { ArrowLeft, Plus } from "phosphor-react"
import SelectRoleOrSetRequirements from "platforms/components/SelectRoleOrSetRequirements"
import platforms from "platforms/platforms"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"
import {
  AddRewardProvider,
  RoleTypeToAddTo,
  useAddRewardContext,
} from "../AddRewardContext"
import { useIsTabsStuck } from "../Tabs/Tabs"
import { useThemeContext } from "../ThemeContext"
import useAddReward from "./hooks/useAddReward"

// temporary until POAPs are real rewards
const DynamicAddPoapPanel = dynamic(() => import("components/[guild]/CreatePoap"), {
  ssr: false,
})

const AddRewardButton = (): JSX.Element => {
  const {
    modalRef,
    selection,
    setSelection,
    step,
    setStep,
    activeTab,
    isOpen,
    onOpen,
    onClose,
  } = useAddRewardContext()

  const methods = useForm()

  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

  const goBack = () => {
    if (step === "SELECT_ROLE") {
      setStep("HOME")
      methods.reset()
    } else {
      setSelection(null)
    }
  }

  const requirements = useWatch({ name: "requirements", control: methods.control })
  const isAddRewardButtonDisabled =
    activeTab === RoleTypeToAddTo.NEW_ROLE && !requirements?.length

  const { onSubmit: onAddRewardSubmit, isLoading: isAddRewardLoading } =
    useAddReward(onClose)
  const { onSubmit: onCreateRoleSubmit, isLoading: isCreateRoleLoading } =
    useCreateRole(onClose)

  const isLoading = isAddRewardLoading || isCreateRoleLoading

  const onSubmit = (data: any) => {
    if (data.requirements?.length > 0) {
      onCreateRoleSubmit({
        ...data,
        name: data.name || `New ${platforms[selection].name} role`,
        imageUrl: data.imageUrl || `/guildLogos/${getRandomInt(286)}.svg`,
      })
    } else {
      onAddRewardSubmit({
        ...data.rolePlatforms[0].guildPlatform,
        roleIds: data.roleIds?.filter((roleId) => !!roleId),
      })
    }
  }

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
            methods.reset()
            onClose()
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
                <PlatformsGrid onSelection={setSelection} showPoap showGeneral />
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
