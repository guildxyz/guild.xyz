import {
  Button,
  Icon,
  IconButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import ColorButton from "components/common/ColorButton"
import { useColorContext } from "components/common/ColorContext"
import Modal from "components/common/Modal"
import { useGroup } from "components/[group]/Context"
import { PaintBrush } from "phosphor-react"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useGuild } from "../../[guild]/Context"
import ColorModePicker from "./components/ColorModePicker"
import ColorPicker from "./components/ColorPicker"
import useEdit from "./hooks/useEdit"

type Props = {
  white?: boolean
}

const CustomizationButton = ({ white }: Props): JSX.Element => {
  const guild = useGuild()
  const group = useGroup()

  const methods = useForm({
    mode: "all",
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { onSubmit, isLoading } = useEdit(onClose)
  const { setThemeMode, themeMode } = useColorContext()

  const onCloseHandler = () => {
    const receivedThemeMode = group?.theme?.[0]?.mode || guild?.themeMode
    if (receivedThemeMode !== themeMode) setThemeMode(receivedThemeMode)
    onClose()
  }

  useEffect(() => {
    if (group && !guild) {
      methods.setValue("theme.color", group.theme?.[0]?.color)
    } else {
      methods.setValue("themeColor", guild.themeColor)
    }
  }, [group, guild])

  return (
    <>
      {white ? (
        <IconButton
          aria-label="Edit"
          minW={12}
          rounded="2xl"
          isLoading={isLoading}
          onClick={onOpen}
          icon={<Icon as={PaintBrush} />}
        />
      ) : (
        <ColorButton
          color="primary.500"
          rounded="2xl"
          isLoading={isLoading}
          onClick={onOpen}
        >
          <Icon as={PaintBrush} />
        </ColorButton>
      )}
      <Modal {...{ isOpen, onClose: onCloseHandler }}>
        <ModalOverlay>
          <ModalContent>
            <FormProvider {...methods}>
              <ModalHeader>Edit appearance</ModalHeader>

              <ModalBody>
                <VStack alignItems="start" spacing={4} width="full">
                  <ColorPicker
                    label="Main color"
                    fieldName={group ? "theme.color" : "themeColor"}
                  />
                  {group && (
                    <>
                      <ColorModePicker label="Color mode" fieldName="theme.mode" />
                      <VStack alignItems="start" spacing={1}>
                        <Text fontWeight="medium">Theme</Text>
                        <Tag>Coming soon</Tag>
                      </VStack>
                    </>
                  )}
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

export default CustomizationButton
