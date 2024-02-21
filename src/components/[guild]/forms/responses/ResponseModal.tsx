import {
  Box,
  ButtonGroup,
  Circle,
  Divider,
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
import { Row } from "@tanstack/react-table"
import FormFieldTitle from "components/[guild]/CreateFormModal/components/FormCardEditable/components/FormFieldTitle"
import { fieldTypes } from "components/[guild]/CreateFormModal/formConfig"
import { WalletTag } from "components/[guild]/crm/Identities"
import UserPlatformTags from "components/[guild]/crm/UserPlatformTags"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import Button from "components/common/Button"
import GuildAvatar from "components/common/GuildAvatar"
import { Modal } from "components/common/Modal"
import useResolveAddress from "hooks/useResolveAddress"
import { ArrowRight, CaretLeft, CaretRight } from "phosphor-react"
import { FormSubmission } from "platforms/Forms/hooks/useFormSubmissions"
import shortenHex from "utils/shortenHex"

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
    areSocialsPrivate,
    responses,
    submittedAt,
    formId,
  } = row?.original ?? {}

  const { form } = useGuildForm(formId)

  const primaryAddress = addresses?.[0]
  const domain = useResolveAddress(primaryAddress)

  const avatarBg = useColorModeValue("gray.100", "blackAlpha.200")
  const darkBg = useColorModeValue("gray.50", "blackAlpha.300")

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="100vh !important">
        <ModalCloseButton top={9} right={8} />

        <ModalHeader pb="6" borderBottomWidth="1px">
          <Text colorScheme={"gray"} fontSize="sm" mb="4">
            {`${form?.name ?? "Form"} submission by`}
          </Text>
          <HStack spacing={2.5}>
            <Circle size={12} bg={avatarBg}>
              <GuildAvatar
                address={primaryAddress}
                size={5}
                display="flex"
                alignItems="center"
              />
            </Circle>
            <UserPlatformTags
              {...{ platformUsers, areSocialsPrivate }}
              spacing="1"
              fontFamily="body"
            >
              <WalletTag>
                {!platformUsers?.length
                  ? shortenHex(primaryAddress ?? "")
                  : addresses?.length}
              </WalletTag>
              <Button
                size="xs"
                borderRadius="md"
                borderWidth="1.5px"
                variant="outline"
                rightIcon={<ArrowRight />}
              >
                View in members
              </Button>
            </UserPlatformTags>
          </HStack>
        </ModalHeader>

        <ModalBody bg={darkBg} py={"8 !important"}>
          <Stack gap="5">
            {form?.fields?.map((field) => {
              const { DisplayComponent } = fieldTypes.find(
                (ft) => ft.value === field.type
              )
              const value = responses.find((f) => f.fieldId === field.id).value

              return (
                <Box key={field.id}>
                  <FormFieldTitle field={field} mb={2} />
                  <DisplayComponent
                    field={field}
                    isDisabled
                    // this is not needed now that the value always comes as a string, can be removed if it remains like this
                    value={typeof value === "number" ? value.toString() : value}
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
