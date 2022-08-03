import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import OnboardingMarker from "components/common/OnboardingMarker"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import SetRequirements from "components/create-guild/Requirements"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { useOnboardingContext } from "components/[guild]/Onboarding/components/OnboardingProvider"
import RolePlatforms from "components/[guild]/RolePlatforms"
import AddPlatformButton from "components/[guild]/RolePlatforms/components/AddPlatformButton"
import { manageKeyPairAfterUserMerge } from "hooks/useKeyPair"
import usePinata from "hooks/usePinata"
import { useSubmitWithSign } from "hooks/useSubmit"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { Check, PencilSimple, TwitterLogo } from "phosphor-react"
import { useEffect, useRef } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { Role } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"
import getRandomInt from "utils/getRandomInt"
import mapRequirements from "utils/mapRequirements"
import useTwitterAuth from "../../../JoinButton/components/JoinModal/hooks/useTwitterAuth"
import DeleteRoleButton from "./components/DeleteRoleButton"
import useEditRole from "./hooks/useEditRole"

type Props = {
  roleData: Role
}

const EditRole = ({ roleData }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })
  const btnRef = useRef()

  const { roles } = useGuild()
  const { id, name, description, imageUrl, logic, requirements, rolePlatforms } =
    roleData

  const defaultValues = {
    roleId: id,
    name,
    description,
    imageUrl,
    logic,
    requirements: mapRequirements(requirements),
    rolePlatforms: rolePlatforms ?? [],
  }
  const methods = useForm({
    mode: "all",
    defaultValues,
  })

  const onSuccess = () => {
    onClose()
    methods.reset(undefined, { keepValues: true })
  }

  const { onSubmit, isLoading, isSigning, signLoadingText } = useEditRole(
    id,
    onSuccess
  )

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

  const iconUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      methods.setValue(
        "imageUrl",
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`,
        {
          shouldTouch: true,
        }
      )
    },
    onError: () => {
      methods.setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`, {
        shouldTouch: true,
      })
    },
  })

  const formRequirements = useWatch({
    name: "requirements",
    control: methods.control,
  })

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    (...props) => {
      methods.clearErrors("requirements")
      if (
        !formRequirements ||
        formRequirements?.length === 0 ||
        formRequirements?.every(({ type }) => !type)
      ) {
        methods.setError(
          "requirements",
          {
            message: "Set some requirements, or make the role free",
          },
          { shouldFocus: true }
        )
        document.getElementById("free-entry-checkbox")?.focus()
      } else {
        return methods.handleSubmit(onSubmit)(...props)
      }
    },

    iconUploader.isUploading
  )

  const loadingText = signLoadingText || uploadLoadingText || "Saving data"

  const { localStep } = useOnboardingContext()

  const isTwitterRequirementSet = formRequirements.some(({ type }) =>
    type?.startsWith("TWITTER")
  )
  const { authData, isAuthenticating, onOpen: onTwitterAuthOpen } = useTwitterAuth()

  const { platformUsers, mutate } = useUser()
  const isTwitterConnected = platformUsers?.some(
    ({ platformName }) => platformName === "TWITTER"
  )

  const user = useUser()
  const fetcherWithSign = useFetcherWithSign()
  const { account } = useWeb3React()

  const connect = useSubmitWithSign(
    ({ data, validation }) =>
      fetcher("/user/connect", {
        method: "POST",
        body: { payload: data, ...validation },
      }).then(() => manageKeyPairAfterUserMerge(fetcherWithSign, user, account)),
    {
      onSuccess: () => {
        mutate()
        handleSubmit(null)
      },
    }
  )

  useEffect(() => {
    if (authData && !isTwitterConnected) {
      connect.onSubmit({
        platformName: "TWITTER",
        authData,
      })
    }
  }, [authData, isTwitterConnected])

  return (
    <>
      <OnboardingMarker step={0} onClick={onOpen}>
        <IconButton
          ref={btnRef}
          icon={<Icon as={PencilSimple} />}
          size="sm"
          rounded="full"
          aria-label="Edit role"
          data-dd-action-name={
            localStep === null ? "Edit role" : "Edit role [onboarding]"
          }
          onClick={onOpen}
        />
      </OnboardingMarker>

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
            <DrawerHeader title="Edit role">
              {roles?.length > 1 && <DeleteRoleButton roleId={id} />}
            </DrawerHeader>
            <FormProvider {...methods}>
              <VStack spacing={10} alignItems="start">
                <Section
                  title="Platforms"
                  spacing="6"
                  titleRightElement={
                    <HStack flexGrow={1} justifyContent={"end"}>
                      <AddPlatformButton />
                    </HStack>
                  }
                >
                  <RolePlatforms />
                </Section>
                <Section title="General" spacing="6">
                  <Box>
                    <FormLabel>Logo and name</FormLabel>
                    <HStack spacing={2} alignItems="start">
                      <IconSelector uploader={iconUploader} />
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
            {isTwitterRequirementSet && !isTwitterConnected ? (
              <Button
                colorScheme="twitter"
                leftIcon={<TwitterLogo />}
                onClick={onTwitterAuthOpen}
                isLoading={
                  isAuthenticating ||
                  connect.isLoading ||
                  connect.isSigning ||
                  (!isTwitterConnected && !!authData)
                }
                loadingText={
                  connect.signLoadingText ||
                  (isAuthenticating && "Check the popup") ||
                  "Logging in"
                }
              >
                Log in
              </Button>
            ) : (
              <Button
                disabled={isLoading || isSigning || isUploadingShown}
                isLoading={isLoading || isSigning || isUploadingShown}
                colorScheme="green"
                loadingText={loadingText}
                onClick={handleSubmit}
                leftIcon={<Icon as={Check} />}
              >
                Save
              </Button>
            )}
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

export default EditRole
