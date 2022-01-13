import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  MenuItem,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import LogicPicker from "components/create-guild/LogicPicker"
import NameAndIcon from "components/create-guild/NameAndIcon"
import Requirements from "components/create-guild/Requirements"
import DeleteGuildCard from "components/[guild]/edit/index/DeleteGuildCard"
import useEdit from "components/[guild]/EditButtonGroup/components/CustomizationButton/hooks/useEdit"
import useGuild from "components/[guild]/hooks/useGuild"
import usePersonalSign from "hooks/usePersonalSign"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { GearSix } from "phosphor-react"
import { useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import tryToParse from "utils/tryToParse"

const EditGuildButton = (): JSX.Element => {
  const { name, imageUrl, description, platforms } = useGuild()

  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })

  const { isSigning } = usePersonalSign()
  const { onSubmit, isLoading, isImageLoading, response } = useEdit()

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isImageLoading) return "Uploading image"
    return "Saving data"
  }

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
          requirements: platforms[0]?.roles?.[0].requirements?.map(
            (requirement) => ({
              active: true,
              type: requirement.type,
              chain: requirement.chain,
              address:
                requirement.type === "COIN"
                  ? "0x0000000000000000000000000000000000000000"
                  : requirement.address,
              key: requirement.key,
              value: tryToParse(requirement.value),
            })
          ),
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
  const alertCancelRef = useRef()
  const transition = useBreakpointValue<any>({ base: "slideInBottom", sm: "scale" })

  const onCloseAndClear = () => {
    methods.reset(defaultValues)
    onAlertClose()
    onClose()
  }

  useEffect(() => {
    if (response) onClose()
  }, [response])

  return (
    <>
      <MenuItem py="2" cursor="pointer" onClick={onOpen} icon={<GearSix />}>
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
          <DrawerCloseButton rounded="full" />
          <DrawerHeader>Edit guild</DrawerHeader>

          <DrawerBody className="custom-scrollbar">
            <FormProvider {...methods}>
              <VStack spacing={10} alignItems="start">
                <Section title="Choose a logo and name for your role">
                  <NameAndIcon />
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

                <Divider
                  borderColor={colorMode === "light" ? "blackAlpha.400" : undefined}
                />

                <DeleteGuildCard />
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
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        motionPreset={transition}
        leastDestructiveRef={alertCancelRef}
        {...{ isOpen: isAlertOpen, onClose: onAlertClose }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Are you sure?</AlertDialogHeader>
            <AlertDialogBody>Do you really want to discard changes?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={alertCancelRef} onClick={onAlertClose}>
                Keep editing
              </Button>
              <Button colorScheme="red" ml={3} onClick={onCloseAndClear}>
                Discard changes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default EditGuildButton
