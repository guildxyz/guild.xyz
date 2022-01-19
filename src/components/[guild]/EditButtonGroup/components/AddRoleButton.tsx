import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Heading,
  MenuItem,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import useCreate from "components/create-guild/hooks/useCreate"
import LogicPicker from "components/create-guild/LogicPicker"
import NameAndIcon from "components/create-guild/NameAndIcon"
import Requirements from "components/create-guild/Requirements"
import useGuild from "components/[guild]/hooks/useGuild"
import usePersonalSign from "hooks/usePersonalSign"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { Plus } from "phosphor-react"
import { useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"

const AddRoleButton = (): JSX.Element => {
  const { id, platforms } = useGuild()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })

  const { isSigning } = usePersonalSign()
  const { onSubmit, isLoading, isImageLoading, response } = useCreate()

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isImageLoading) return "Uploading image"
    return "Saving data"
  }

  const defaultValues = {
    guildId: id,
    platform: platforms?.[0]?.platformType,
    platformId: platforms?.[0]?.platformIdentifier,
    channelId: platforms?.[0]?.inviteChannel,
    name: "",
    description: "",
    logic: "AND",
    requirements: [],
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

    methods.reset({
      name: "",
      description: "",
      logic: "AND",
      requirements: [],
    })
  }, [response])

  return (
    <>
      <MenuItem py="2" cursor="pointer" onClick={onOpen} icon={<Plus />}>
        Add role
      </MenuItem>

      <Drawer
        isOpen={isOpen}
        placement="left"
        size={drawerSize}
        onClose={methods.formState.isDirty ? onAlertOpen : onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody className="custom-scrollbar">
            <DrawerHeader title="Add role">
              <DrawerCloseButton rounded="full" />
            </DrawerHeader>
            <FormProvider {...methods}>
              <VStack spacing={10} alignItems="start">
                <Section title="Choose a logo and name for your role">
                  <NameAndIcon />
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
              disabled={isLoading || isImageLoading || isSigning}
              isLoading={isLoading || isImageLoading || isSigning}
              colorScheme="green"
              loadingText={loadingText()}
              onClick={methods.handleSubmit(onSubmit)}
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

export default AddRoleButton
