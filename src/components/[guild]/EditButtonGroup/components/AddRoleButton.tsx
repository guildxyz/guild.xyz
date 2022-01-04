import {
  Button,
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
import useCreate from "components/create-guild/hooks/useCreate"
import LogicPicker from "components/create-guild/LogicPicker"
import NameAndIcon from "components/create-guild/NameAndIcon"
import Requirements from "components/create-guild/Requirements"
import usePersonalSign from "hooks/usePersonalSign"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { Plus } from "phosphor-react"
import { useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Platform } from "types"

type Props = {
  guildId: number
  platforms: Array<Platform>
}

const AddRoleButton = ({ guildId, platforms }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
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

  const methods = useForm({
    mode: "all",
    defaultValues: {
      guildId: guildId,
      platform: platforms?.[0]?.platformType,
      discordServerId: platforms?.[0]?.platformIdentifier,
      channelId: platforms?.[0]?.inviteChannel,
    },
  })

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  return (
    <>
      <MenuItem py="2" cursor="pointer" onClick={onOpen} icon={<Plus />}>
        Add role
      </MenuItem>

      <Drawer
        isOpen={isOpen}
        placement="left"
        size={drawerSize}
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton rounded="full" />
          <DrawerHeader
            bgColor={colorMode === "light" ? "white" : "gray.800"}
            fontFamily="display"
            fontWeight="black"
            fontSize="4xl"
          >
            Add role
          </DrawerHeader>

          <DrawerBody
            bgColor={colorMode === "light" ? "white" : "gray.800"}
            className="custom-scrollbar"
          >
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

          <DrawerFooter bgColor={colorMode === "light" ? "white" : "gray.800"}>
            <Button variant="outline" mr={3} onClick={onClose}>
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
    </>
  )
}

export default AddRoleButton
