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
import { useColorContext } from "components/common/ColorContext"
import Modal from "components/common/Modal"
import { useGroup } from "components/[group]/Context"
import { PaintBrush } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import { useGuild } from "../../[guild]/Context"
import ColorModePicker from "./components/ColorModePicker"
import ColorPicker from "./components/ColorPicker"
import useEdit from "./hooks/useEdit"

const EditButton = (): JSX.Element => {
  const guild = useGuild()
  const group = useGroup()
  const methods = useForm({
    mode: "all",
    defaultValues: {
      themeColor: group?.theme?.color || guild?.themeColor,
    },
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, isLoading } = useEdit(
    group ? "group" : "guild",
    group?.id || guild?.id,
    onClose
  )
  const { setThemeMode, themeMode } = useColorContext()

  const onCloseHandler = () => {
    const receivedThemeMode = group?.theme?.mode || guild?.themeMode
    if (receivedThemeMode !== themeMode) setThemeMode(receivedThemeMode)
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
