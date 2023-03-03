import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import { Modal } from "components/common/Modal"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useToast from "hooks/useToast"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { FormProvider, useForm } from "react-hook-form"
import { CreatePoapForm as CreatePoapFormType } from "types"
import useUpdateGuildPoap from "../../hooks/useUpdateGuildPoap"
import useUpdatePoap from "../../hooks/useUpdatePoap"
import PoapDataForm from "./PoapDataForm"

const EditPoapModal = ({ guildPoap, poap, isOpen, onClose }): JSX.Element => {
  const toast = useToast()

  const defaultValues = {
    ...poap,
    image: poap.image_url,
    start_date: convertPoapDate(poap.start_date),
    end_date: convertPoapDate(poap.end_date),
    expiry_date: convertPoapDate(poap.expiry_date),
  }

  const methods = useForm<CreatePoapFormType>({
    mode: "all",
    defaultValues,
  })

  const { onSubmit: onUpdateGuildPoapSubmit, isLoading: isUpdateGuildPoapLoading } =
    useUpdateGuildPoap(guildPoap)
  const { onSubmit: onUpdatePoapSubmit, isLoading: isUpdatePoapLoading } =
    useUpdatePoap({
      onSuccess: () => {
        toast({ status: "success", title: "Successfully updated POAP" })
        onClose()
      },
    })

  const onSubmit = (data) => {
    onUpdatePoapSubmit(data)
    onUpdateGuildPoapSubmit({
      id: guildPoap?.id,
      expiryDate: data.expiry_date?.length
        ? new Date(data.expiry_date).getTime() / 1000
        : undefined,
    })
  }

  const isDirty = !!Object.keys(methods.formState.dirtyFields).length
  useWarnIfUnsavedChanges(isDirty && !methods.formState.isSubmitted)

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const onCloseAndClear = () => {
    methods.reset(defaultValues)
    onAlertClose()
    onClose()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={isDirty ? onAlertOpen : onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit POAP</ModalHeader>
          <ModalCloseButton />
          <FormProvider {...methods}>
            <ModalBody>
              <PoapDataForm />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCloseAndClear}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                onClick={methods.handleSubmit(onSubmit)}
                isDisabled={isUpdatePoapLoading || isUpdateGuildPoapLoading}
                isLoading={isUpdatePoapLoading || isUpdateGuildPoapLoading}
                loadingText={`Updating POAP`}
              >
                Update POAP
              </Button>
            </ModalFooter>
            <DynamicDevTool control={methods.control} />
          </FormProvider>
        </ModalContent>
      </Modal>
      <DiscardAlert
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        onDiscard={onCloseAndClear}
      />
    </>
  )
}

const convertPoapDate = (date: string): string => {
  if (!date) return ""

  // Firefox hack
  const [day, month, year] = date.split("-")
  const convertedPoapDate = new Date(`${day}-${month}${year}`)

  const convertedYear = convertedPoapDate.getFullYear()
  const convertedMonth = convertedPoapDate.getMonth() + 1
  const convertedDay = convertedPoapDate.getDate()
  const newExpiryDateValue = `${convertedYear}-${
    (convertedMonth < 10 ? "0" : "") + convertedMonth
  }-${(convertedDay < 10 ? "0" : "") + convertedDay}`

  return newExpiryDateValue
}

export default EditPoapModal
