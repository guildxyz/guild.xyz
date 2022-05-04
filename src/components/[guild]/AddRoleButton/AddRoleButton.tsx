import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import OnboardingMarker from "components/common/OnboardingMarker"
import RadioSelect from "components/common/RadioSelect"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import SetRequirements from "components/create-guild/Requirements"
import useGuild from "components/[guild]/hooks/useGuild"
import useUploadPromise from "hooks/useUploadPromise"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { Plus } from "phosphor-react"
import { useEffect, useRef } from "react"
import { FormProvider, useController, useForm, useWatch } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"
import ChannelsToGate from "../RolesByPlatform/components/RoleListItem/components/EditRole/components/ChannelsToGate"
import ExistingRoleSettings from "./components/ExistingRoleSettings"

const roleOptions = [
  {
    value: "NEW",
    title: "Create a new role for me",
  },
  {
    value: "EXISTING",
    title: "Manage an existing role",
    children: <ExistingRoleSettings />,
  },
]

const AddRoleButton = (): JSX.Element => {
  const { id, platforms } = useGuild()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalFocusRef = useRef(null)
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })

  const { onSubmit, isLoading, response, isSigning } = useCreateRole()

  const defaultValues = {
    guildId: id,
    ...(platforms?.[0]
      ? {
          platform: platforms[0].type,
          platformId: platforms[0].platformId,
        }
      : {}),
    // channelId: platforms?.[0]?.inviteChannel,
    name: "",
    description: "",
    logic: "AND",
    requirements: [],
    roleType: "NEW",
    activationInterval: 0,
    includeUnauthenticated: true,
    discordRoleId: undefined,
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
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
    methods.reset(defaultValues)
  }, [response])

  const { handleSubmit, shouldBeLoading, isUploading, setUploadPromise } =
    useUploadPromise(methods.handleSubmit)

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isUploading) return "Uploading image"
    return "Saving data"
  }

  const { field } = useController({
    control: methods.control,
    name: "roleType",
  })

  const discordRoleId = useWatch({ name: "discordRoleId", control: methods.control })

  return (
    <>
      <OnboardingMarker step={0} w="full">
        <Button
          ref={finalFocusRef}
          variant="ghost"
          w="full"
          opacity="0.5"
          h="16"
          iconSpacing={{ base: 6, md: 10 }}
          justifyContent="left"
          leftIcon={<Icon as={Plus} boxSize="1.2em" />}
          onClick={onOpen}
          data-dd-action-name="Add role"
        >
          Add role
        </Button>
      </OnboardingMarker>
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
                <Section title={"Discord settings"} spacing="6">
                  <FormControl
                    isRequired
                    isInvalid={!!methods?.formState?.errors?.platform}
                  >
                    <RadioSelect
                      options={roleOptions}
                      colorScheme="DISCORD"
                      name="roleType"
                      onChange={field.onChange}
                      value={field.value}
                    />
                    <FormErrorMessage>
                      {methods?.formState?.errors?.platform?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <Box>
                    <ChannelsToGate
                      roleId={field.value === "NEW" ? undefined : discordRoleId}
                    />
                  </Box>
                </Section>

                <Divider />

                <Section title={"General"} spacing="6">
                  <Box>
                    <FormLabel>Choose a logo and name for your role</FormLabel>
                    <HStack spacing={2} alignItems="start">
                      <IconSelector setUploadPromise={setUploadPromise} />
                      <Name />
                    </HStack>
                  </Box>
                  <Description />
                  <SetRequirements maxCols={2} />
                </Section>
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
        <DynamicDevTool control={methods.control} />
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
