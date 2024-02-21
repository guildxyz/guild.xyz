import {
  Box,
  ButtonGroup,
  Divider,
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
import { Row } from "@tanstack/react-table"
import FormFieldTitle from "components/[guild]/CreateFormModal/components/FormCardEditable/components/FormFieldTitle"
import { fieldTypes } from "components/[guild]/CreateFormModal/formConfig"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { CaretLeft, CaretRight } from "phosphor-react"
import { FormSubmission } from "platforms/Forms/hooks/useFormSubmissions"

type Props = {
  row: Row<FormSubmission>
  isOpen: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

const ResponseModal = ({ row, isOpen, onClose, onPrev, onNext }: Props) => {
  const { submissionAnswers, createdAt, formId } = row?.original ?? {}

  const { form } = useGuildForm(formId)

  const darkBg = useColorModeValue("gray.50", "blackAlpha.300")

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="100vh !important">
        <ModalCloseButton top={9} right={8} />

        <ModalHeader pb="6" borderBottomWidth="1px">
          <Text colorScheme={"gray"} fontSize="sm">
            {`${form?.name ?? "Form"} submission by`}
          </Text>
          <Text mt="4" mb="2">
            User soon
          </Text>
        </ModalHeader>

        <ModalBody bg={darkBg} py={"8 !important"}>
          <Stack gap="5">
            {form?.fields?.map((field) => {
              const { DisplayComponent } = fieldTypes.find(
                (ft) => ft.value === field.type
              )

              return (
                <Box key={field.id}>
                  <FormFieldTitle field={field} mb={2} />
                  <DisplayComponent
                    field={field}
                    isDisabled
                    value={
                      submissionAnswers.find((f) => f.fieldId === field.id).value
                    }
                  />
                </Box>
              )
            })}
          </Stack>
        </ModalBody>

        <ModalFooter py="5" justifyContent={"space-between"} borderTopWidth={"1px"}>
          <Text colorScheme={"gray"} fontWeight={"medium"} fontSize="sm">
            {new Date(createdAt).toLocaleString()}
          </Text>

          <ButtonGroup size="sm" variant={"ghost"} isAttached mr="-3">
            <Button onClick={onPrev} isDisabled={!onPrev} leftIcon={<CaretLeft />}>
              Prev
            </Button>
            <Divider orientation="vertical" h="8" />
            <Button onClick={onNext} isDisabled={!onNext} rightIcon={<CaretRight />}>
              Next
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ResponseModal
