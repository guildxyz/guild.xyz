import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Icon,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import LogicPicker from "components/create-guild/LogicPicker"
import NameAndIcon from "components/create-guild/NameAndIcon"
import Requirements from "components/create-guild/Requirements"
import DeleteRoleButton from "components/[guild]/edit/[role]/DeleteRoleButton"
import useEditRole from "components/[guild]/edit/[role]/hooks/useEditRole"
import usePersonalSign from "hooks/usePersonalSign"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { Check, PencilSimple } from "phosphor-react"
import { useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Role } from "types"
import mapRequirements from "utils/mapRequirements"

type Props = {
  roleData: Role
}

const EditRole = ({ roleData }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const nameAndIconRef = useRef()
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })

  const { id, name, description, imageUrl, logic, requirements } = roleData

  const { isSigning } = usePersonalSign()
  const { onSubmit, isLoading, isImageLoading, response } = useEditRole(id)

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isImageLoading) return "Uploading image"
    return "Saving data"
  }

  const defaultValues = {
    name,
    description,
    imageUrl,
    logic,
    requirements: mapRequirements(requirements),
  }

  const methods = useForm({
    mode: "all",
    defaultValues,
  })

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

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

  useEffect(() => {
    if (!response) return

    onClose()

    // Resetting the form in order to reset the `isDirty` variable
    methods.reset({
      name: methods.getValues("name"),
      description: methods.getValues("description"),
      logic: methods.getValues("logic"),
      requirements: methods.getValues("requirements"),
      imageUrl: response.imageUrl,
    })
  }, [response])

  return (
    <>
      <IconButton
        ref={btnRef}
        icon={<Icon as={PencilSimple} />}
        size="sm"
        rounded="full"
        aria-label="Edit role"
        onClick={onOpen}
      />

      <Drawer
        isOpen={isOpen}
        placement="left"
        size={drawerSize}
        onClose={methods.formState.isDirty ? onAlertOpen : onClose}
        initialFocusRef={nameAndIconRef}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <DrawerHeader title="Edit role">
              <DeleteRoleButton roleId={id} />
            </DrawerHeader>
            <FormProvider {...methods}>
              <VStack spacing={10} alignItems="start">
                <Section title="Choose a logo and name for your role">
                  <NameAndIcon ref={nameAndIconRef} />
                </Section>

                <Section title="Role description">
                  <Description />
                </Section>

                <Section title="Requirements logic">
                  <LogicPicker />
                </Section>

                <Requirements maxCols={2} />
              </VStack>
            </FormProvider>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onCloseAndClear}>
              Cancel
            </Button>
            <Button
              disabled={isLoading || isImageLoading || isSigning || !!response}
              isLoading={isLoading || isImageLoading || isSigning}
              colorScheme="green"
              loadingText={loadingText()}
              onClick={methods.handleSubmit(onSubmit)}
              leftIcon={<Icon as={Check} />}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <DiscardAlert
        {...{
          isOpen: isAlertOpen,
          onClose: onAlertClose,
          onDiscard: onCloseAndClear,
        }}
      />
    </>
  )
}

export default EditRole
