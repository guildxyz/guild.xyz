import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import dynamic from "next/dynamic"
import { Plus } from "phosphor-react"
import platforms from "platforms/platforms"
import { FormProvider, useForm } from "react-hook-form"
import { AddRewardProvider, useAddRewardContext } from "../AddRewardContext"
import { useIsTabsStuck } from "../Tabs/Tabs"
import { useThemeContext } from "../ThemeContext"

const DynamicDefaultAddPlatformModalContent = dynamic(
  () => import("platforms/DefaultAddPlatformModalContent")
)

const AddRewardButton = (): JSX.Element => {
  const { selection, setSelection, modalRef, isOpen, onOpen, onClose } =
    useAddRewardContext()

  const methods = useForm()

  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

  const { AddPlatformModalContent } = platforms[selection] ?? {}

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
            {selection ? (
              AddPlatformModalContent ? (
                <AddPlatformModalContent />
              ) : (
                <DynamicDefaultAddPlatformModalContent />
              )
            ) : (
              <>
                <ModalCloseButton />
                <ModalHeader>Add reward</ModalHeader>
                <ModalBody ref={modalRef}>
                  <PlatformsGrid onSelection={setSelection} showPoap />
                </ModalBody>
              </>
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
