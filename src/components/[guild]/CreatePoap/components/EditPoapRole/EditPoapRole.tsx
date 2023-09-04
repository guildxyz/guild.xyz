import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Tag,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import useToast from "hooks/useToast"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { Check, PencilSimple } from "phosphor-react"
import { useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { GuildPoap, Poap } from "types"
import mapRequirements from "utils/mapRequirements"
import useUpdatePoapRequirements from "../../hooks/useUpdatePoapRequirements"
import EditPoapModal from "../PoapDataForm/EditPoapModal"
import PoapRequirements from "../PoapRequirements/PoapRequirements"
import PoapRewardCard from "../PoapRewardCard"

type Props = {
  poap: Poap
  guildPoap: GuildPoap
}

/**
 * This is copy-pasted from EditRole and adjusted to work with legacy POAP logic.
 * Will delete once POAP is a real reward
 */
const EditPoapRole = ({ poap, guildPoap }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const btnRef = useRef()

  const defaultValues = {
    poapId: guildPoap.id,
    name: poap.name,
    description: poap.description,
    imageUrl: poap.image_url,
    requirements: mapRequirements(guildPoap.poapRequirements),
    // Pretty messy, but will be removed once POAP becames a real reward
    logic: (guildPoap.poapRequirements?.[0] as any)?.logic ?? "OR",
  }
  const methods = useForm({
    mode: "all",
    defaultValues,
  })

  const onSuccess = () => {
    toast({
      status: "success",
      title: "Role successfully updated!",
    })
    onClose()
    methods.reset(undefined, { keepValues: true })
  }

  const { onSubmit, isLoading, isSigning, signLoadingText } =
    useUpdatePoapRequirements(guildPoap, { onSuccess })

  const isDirty = !!Object.keys(methods.formState.dirtyFields).length
  useWarnIfUnsavedChanges(isDirty && !methods.formState.isSubmitted)

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

  const loadingText = signLoadingText || "Saving data"

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
        size={{ base: "full", md: "lg" }}
        onClose={isDirty ? onAlertOpen : onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody className="custom-scrollbar">
            <DrawerHeader title="Edit role"></DrawerHeader>
            <FormProvider {...methods}>
              <VStack spacing={10} alignItems="start">
                <Section title={"Rewards"}>
                  <PoapRewardCard
                    guildPoap={guildPoap}
                    actionRow={<EditPoapButton guildPoap={guildPoap} poap={poap} />}
                  />
                </Section>
                <Section
                  title="General"
                  titleRightElement={<Tag>Automatic based on POAP data</Tag>}
                >
                  <Box>
                    <FormLabel opacity={0.4}>Logo and name</FormLabel>
                    <HStack spacing={2} alignItems="start">
                      <IconSelector uploader={null} isDisabled />
                      <Name isDisabled />
                    </HStack>
                  </Box>
                  <Description isDisabled />
                </Section>
                <Section title="Requirements">
                  <PoapRequirements guildPoap={guildPoap} />
                </Section>
              </VStack>
            </FormProvider>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onCloseAndClear}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading || isSigning}
              colorScheme="green"
              loadingText={loadingText}
              onClick={methods.handleSubmit(onSubmit)}
              leftIcon={<Icon as={Check} />}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
        <DynamicDevTool control={methods.control} />
      </Drawer>

      <DiscardAlert
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        onDiscard={onCloseAndClear}
      />
    </>
  )
}

const EditPoapButton = ({ guildPoap, poap }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button
        size="sm"
        alignSelf={{ base: "stretch", md: "center" }}
        onClick={onOpen}
      >
        Edit POAP
      </Button>
      <EditPoapModal
        {...{
          guildPoap,
          poap,
          isOpen,
          onClose,
        }}
      />
    </>
  )
}

export default EditPoapRole
