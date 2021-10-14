import {
  Button,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import ColorButton from "components/common/ColorButton"
import Modal from "components/common/Modal"
import PhotoUploader from "components/common/PhotoUploader"
import { PaintBrush } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import { useColorContext } from "../ColorContext"
import { useGuild } from "../Context"
import ColorModePicker from "./components/ColorModePicker"
import ColorPicker from "./components/ColorPicker"
import useEdit from "./hooks/useEdit"

const EditButton = (): JSX.Element => {
  const { themeMode, themeColor } = useGuild()
  const methods = useForm({
    mode: "all",
    defaultValues: {
      themeColor,
    },
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, isLoading } = useEdit(onClose)
  const { setThemeMode, themeMode: localThemeMode } = useColorContext()

  const onCloseHandler = () => {
    if (themeMode !== localThemeMode) setThemeMode(themeMode)
    onClose()
  }

  return (
    <>
      <ColorButton
        color="primary.500"
        rounded="2xl"
        isLoading={isLoading}
        onClick={onOpen}
      >
        <Icon as={PaintBrush} />
      </ColorButton>
      <Modal {...{ isOpen, onClose: onCloseHandler }}>
        <ModalOverlay>
          <ModalContent>
            <FormProvider {...methods}>
              <ModalHeader>Edit appearance</ModalHeader>

              <ModalBody>
                <VStack alignItems="start" spacing={4} width="full">
                  <ColorPicker label="Main color" />
                  <ColorModePicker label="Color mode" />
                  <PhotoUploader label="Custom icon" />
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onCloseHandler}>Cancel</Button>
                <Button
                  isDisabled={!methods.formState.isDirty || isLoading}
                  colorScheme="primary"
                  onClick={methods.handleSubmit(onSubmit)}
                  ml={3}
                >
                  Save
                </Button>
              </ModalFooter>
            </FormProvider>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  )
}

export default EditButton
