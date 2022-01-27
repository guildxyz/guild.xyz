import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  DrawerProps,
  HStack,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import useCreate from "components/create-guild/hooks/useCreate"
import IconSelector from "components/create-guild/IconSelector"
import LogicPicker from "components/create-guild/LogicPicker"
import Name from "components/create-guild/Name"
import Requirements from "components/create-guild/Requirements"
import useGuild from "components/[guild]/hooks/useGuild"
import usePersonalSign from "hooks/usePersonalSign"
import useUploadPromise from "hooks/useUploadPromise"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"

const AddRoleDrawer = ({
  isOpen,
  onClose,
  finalFocusRef,
}: Omit<DrawerProps, "children">): JSX.Element => {
  const { id, platforms } = useGuild()

  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })

  const { isSigning } = usePersonalSign()
  const { onSubmit, isLoading, response } = useCreate()

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

  const { handleSubmit, shouldBeLoading, isUploading, setUploadPromise } =
    useUploadPromise(methods.handleSubmit)

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isUploading) return "Uploading image"
    return "Saving data"
  }

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="left"
        size={drawerSize}
        onClose={methods.formState.isDirty ? onAlertOpen : onClose}
        finalFocusRef={finalFocusRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody className="custom-scrollbar">
            <DrawerHeader title="Add role" />
            <FormProvider {...methods}>
              <VStack spacing={10} alignItems="start">
                <Section title="Choose a logo and name for your role">
                  <HStack spacing={2} alignItems="start">
                    <IconSelector setUploadPromise={setUploadPromise} />
                    <Name />
                  </HStack>
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
              disabled={isLoading || isSigning || shouldBeLoading}
              isLoading={isLoading || isSigning || shouldBeLoading}
              colorScheme="green"
              loadingText={loadingText()}
              onClick={handleSubmit(onSubmit)}
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

export default AddRoleDrawer
