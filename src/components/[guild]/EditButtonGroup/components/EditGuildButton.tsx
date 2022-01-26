import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  MenuItem,
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
import DeleteGuildButton from "components/[guild]/edit/index/DeleteGuildButton"
import useEdit from "components/[guild]/EditButtonGroup/components/CustomizationButton/hooks/useEdit"
import useGuild from "components/[guild]/hooks/useGuild"
import usePersonalSign from "hooks/usePersonalSign"
import useUploadPromise from "hooks/useUploadPromise"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { GearSix } from "phosphor-react"
import { useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import mapRequirements from "utils/mapRequirements"

const EditGuildButton = (): JSX.Element => {
  const { name, imageUrl, description, platforms } = useGuild()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })

  const { isSigning } = usePersonalSign()
  const { onSubmit, isLoading, response } = useEdit()

  const defaultValues =
    platforms[0]?.roles?.length > 1
      ? {
          name: name,
          imageUrl: imageUrl,
          description: description,
        }
      : {
          // When we have only 1 role in a guild, we can edit that role instead of the guild
          name: name,
          imageUrl: imageUrl,
          description: description,
          logic: platforms[0]?.roles?.[0].logic,
          requirements: mapRequirements(platforms[0]?.roles?.[0].requirements),
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
    methods.reset(
      platforms[0]?.roles?.length > 1
        ? {
            name: methods.getValues("name"),
            description: methods.getValues("description"),
            imageUrl: response.imageUrl,
          }
        : {
            name: methods.getValues("name"),
            description: methods.getValues("description"),
            logic: methods.getValues("logic"),
            requirements: methods.getValues("requirements"),
            imageUrl: response.imageUrl,
          }
    )
  }, [response])

  const { handleSubmit, isUploading, setUploadPromise, shouldBeLoading } =
    useUploadPromise(methods.handleSubmit)

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isUploading) return "Uploading image"
    return "Saving data"
  }

  return (
    <>
      <MenuItem
        ref={btnRef}
        py="2"
        cursor="pointer"
        onClick={onOpen}
        icon={<GearSix />}
      >
        Edit guild
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
          <DrawerBody>
            <DrawerHeader title="Edit guild">
              <DeleteGuildButton />
            </DrawerHeader>
            <FormProvider {...methods}>
              <VStack spacing={10} alignItems="start">
                <Section title="Choose a logo and name for your role">
                  <NameAndIcon setUploadPromise={setUploadPromise} />
                </Section>

                <Section title="Role description">
                  <Description />
                </Section>

                {!(platforms?.[0].roles?.length > 1) && (
                  <>
                    <Section title="Requirements logic">
                      <LogicPicker />
                    </Section>

                    <Requirements maxCols={2} />
                  </>
                )}
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

export default EditGuildButton
