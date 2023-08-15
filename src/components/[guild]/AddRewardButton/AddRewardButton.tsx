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
  RolesOrRequirementsTabs,
  useAddRewardContext,
} from "../AddRewardContext"
import { useIsTabsStuck } from "../Tabs/Tabs"
import { useThemeContext } from "../ThemeContext"
import useAddReward from "./hooks/useAddReward"

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
    if (step === "ROLES_REQUIREMENTS") {
      setStep("HOME")
      methods.reset()
    } else {
      setSelection(null)
    }
  }

  const requirements = useWatch({ name: "requirements", control: methods.control })
  const isAddRewardButtonDisabled =
    activeTab === RolesOrRequirementsTabs.NEW_ROLE && !requirements?.length

  const { onSubmit: onAddRewardSubmit, isLoading: isAddRewardLoading } =
    useAddReward(onClose)
  const { onSubmit: onCreateRoleSubmit, isLoading: isCreateRoleLoading } =
    useCreateRole(onClose)

  const isLoading = isAddRewardLoading || isCreateRoleLoading

  const onSubmit = (data: any) => {
    if (data.requirements?.length > 0) {
      onCreateRoleSubmit({
        ...data,
        name: `New ${platforms[selection].name} role`,
        imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
        roleIds: undefined,
      })
    } else {
      onAddRewardSubmit({
        ...data.rolePlatforms[0].guildPlatform,
        roleIds: data.roleIds?.filter((roleId) => !!roleId),
      })
    }
  }

  const { AddPlatformPanel, PlatformPreview } = platforms[selection] ?? {}
  const shouldShowRewardPreview = step === "ROLES_REQUIREMENTS" && PlatformPreview

  const lightModalBgColor = useColorModeValue("white", "gray.700")

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
          size="4xl"
          scrollBehavior="inside"
          colorScheme="dark"
        >
          <ModalOverlay />
          <ModalContent minH="550px">
            <ModalCloseButton />
            <ModalHeader
              bgColor={shouldShowRewardPreview ? lightModalBgColor : undefined}
            >
              <Stack spacing={8}>
                <HStack>
                  <IconButton
                    rounded="full"
                    aria-label="Back"
                    size="sm"
                    mb="-3px"
                    icon={<ArrowLeft size={20} />}
                    variant="ghost"
                    onClick={goBack}
                  />
                  <Text>
                    {selection
                      ? `Add ${platforms[selection].name} reward`
                      : "Add reward"}
                  </Text>
                </HStack>

                {shouldShowRewardPreview && <PlatformPreview />}
              </Stack>
            </ModalHeader>

            <ModalBody
              pt={shouldShowRewardPreview ? 8 : undefined}
              ref={modalRef}
              className="custom-scrollbar"
            >
              {selection === "POAP" ? (
                <DynamicAddPoapPanel />
              ) : selection && step === "ROLES_REQUIREMENTS" ? (
                <SelectRoleOrSetRequirements selectedPlatform={selection} />
              ) : AddPlatformPanel ? (
                <AddPlatformPanel
                  onSuccess={() => setStep("ROLES_REQUIREMENTS")}
                  skipSettings
                />
              ) : (
                <PlatformsGrid onSelection={setSelection} showPoap />
              )}
            </ModalBody>

            {selection !== "POAP" && step === "ROLES_REQUIREMENTS" && (
              <ModalFooter pt={8}>
                <Button
                  isDisabled={isAddRewardButtonDisabled}
                  colorScheme="green"
                  onClick={methods.handleSubmit(onSubmit)}
                  isLoading={isLoading}
                >
                  Add reward
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
