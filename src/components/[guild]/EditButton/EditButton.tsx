import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import ColorButton from "components/common/ColorButton"
import useSubmitMachine from "components/create-guild/hooks/useSubmitMachine"
import { PaintBrush } from "phosphor-react"
import { useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useGuild } from "../Context"
import ColorModePicker from "./components/ColorModePicker"
import ColorPicker from "./components/ColorPicker"

const EditButton = (): JSX.Element => {
  const methods = useForm({ mode: "all" })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const { themeColor } = useGuild()
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  useEffect(() => {
    methods.reset({
      themeColor,
    })
  }, [])

  const { onSubmit, isLoading, isSuccess } = useSubmitMachine("PATCH")

  useEffect(() => {
    if (isSuccess) onClose()
  }, [isSuccess])

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
      <AlertDialog
        motionPreset={transition}
        leastDestructiveRef={cancelRef}
        {...{ isOpen, onClose }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <FormProvider {...methods}>
              <AlertDialogHeader>Edit Guild</AlertDialogHeader>

              <AlertDialogBody>
                <VStack alignItems="start" spacing={4} width="full">
                  <ColorPicker label="Main color" />
                  <ColorModePicker label="Color mode" />
                </VStack>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  isDisabled={!methods.formState.isDirty || isLoading || isSuccess}
                  colorScheme="primary"
                  onClick={methods.handleSubmit(onSubmit)}
                  ml={3}
                >
                  Save
                </Button>
              </AlertDialogFooter>
            </FormProvider>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default EditButton
