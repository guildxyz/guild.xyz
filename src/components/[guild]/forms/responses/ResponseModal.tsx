import {
  Box,
  ButtonGroup,
  Circle,
  Divider,
  Flex,
  HStack,
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
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { Row } from "@tanstack/react-table"
import FormFieldTitle from "components/[guild]/CreateFormModal/components/FormCardEditable/components/FormFieldTitle"
import { fieldTypes } from "components/[guild]/CreateFormModal/formConfig"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import Button from "components/common/Button"
import GuildAvatar from "components/common/GuildAvatar"
import { Modal } from "components/common/Modal"
import { FormSubmission } from "platforms/Forms/hooks/useFormSubmissions"
import CollapsibleIdentityTags from "./CollapsibleIdentityTags"

type Props = {
  row: Row<FormSubmission>
  isOpen: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

const ResponseModal = ({ row, isOpen, onClose, onPrev, onNext }: Props) => {
  const {
    addresses,
    platformUsers,
    isShared,
    submissionAnswers,
    submittedAt,
    formId,
  } = row?.original ?? {}

  const { form } = useGuildForm(formId)

  const avatarBg = useColorModeValue("gray.100", "blackAlpha.200")
  const darkBg = useColorModeValue("gray.50", "blackAlpha.300")

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="100vh !important">
        <ModalCloseButton top={9} right={8} />

        <ModalHeader pt="6" pb="6" borderBottomWidth="1px">
          <Text colorScheme={"gray"} fontSize="sm" mb="4">
            {`${form?.name ?? "Form"} submission by`}
          </Text>
          <HStack spacing={2.5} alignItems={"flex-start"} fontFamily="body">
            <Circle size={12} bg={avatarBg}>
              <GuildAvatar
                address={addresses?.[0]}
                size={5}
                display="flex"
                alignItems="center"
              />
            </Circle>
            <Flex alignItems={"center"} minH="12">
              <CollapsibleIdentityTags {...{ addresses, platformUsers, isShared }} />
            </Flex>
          </HStack>
        </ModalHeader>

        <ModalBody bg={darkBg} py={"8 !important"}>
          <Stack gap="5">
            {form?.fields?.map((field) => {
              const { DisplayComponent } = fieldTypes.find(
                (ft) => ft.value === field.type
              )
              const value = submissionAnswers.find(
                (f) => f.fieldId === field.id
              )?.value

              return (
                <Box
                  key={field.id}
                  // we render the DisplayComponents as disabled, but retrive / change some of their styles with css so they're displayed nicely
                  sx={{
                    "input:not(.disabledOtherInput), textarea, [data-checked]": {
                      opacity: "1 !important",
                    },
                    "input, textarea": {
                      border: "0 !important",
                      cursor: value && "text !important",
                    },
                    ".chakra-checkbox__control[data-checked], .chakra-radio__control[data-checked], .chakra-button[data-checked]:hover":
                      {
                        background: "primary.500 !important",
                        border: "0 !important",
                      },
                    ".chakra-checkbox__control[data-checked] svg, .chakra-radio__control[data-checked]:before":
                      { color: "white" },
                  }}
                >
                  <FormFieldTitle field={field} mb={2} />
                  <DisplayComponent
                    field={field}
                    isDisabled
                    // the BE sends everything as a string now, this might change in the future
                    value={
                      /* typeof value === "number" ? value.toString() :  */ value
                    }
                  />
                </Box>
              )
            })}
          </Stack>
        </ModalBody>

        <ModalFooter py="5" justifyContent={"space-between"} borderTopWidth={"1px"}>
          <Text colorScheme={"gray"} fontWeight={"medium"} fontSize="sm">
            {new Date(submittedAt).toLocaleString()}
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
