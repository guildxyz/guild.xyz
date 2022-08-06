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
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import DiscardAlert from "components/common/DiscardAlert"
import DrawerHeader from "components/common/DrawerHeader"
import OnboardingMarker from "components/common/OnboardingMarker"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import IconSelector from "components/create-guild/IconSelector"
import Name from "components/create-guild/Name"
import SetRequirements from "components/create-guild/Requirements"
import useGuild from "components/[guild]/hooks/useGuild"
import { manageKeyPairAfterUserMerge } from "hooks/useKeyPair"
import usePinata from "hooks/usePinata"
import { useSubmitWithSign } from "hooks/useSubmit"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { Plus, TwitterLogo } from "phosphor-react"
import { useEffect, useRef } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformType } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"
import getRandomInt from "utils/getRandomInt"
import useUser from "../hooks/useUser"
import useTwitterAuth from "../JoinButton/components/JoinModal/hooks/useTwitterAuth"
import { useOnboardingContext } from "../Onboarding/components/OnboardingProvider"
import RolePlatforms from "../RolePlatforms"
import AddPlatformButton from "../RolePlatforms/components/AddPlatformButton"

const AddRoleButton = (): JSX.Element => {
  const { id, guildPlatforms } = useGuild()
  const discordPlatform = guildPlatforms?.find(
    (p) => p.platformId === PlatformType.DISCORD
  )

  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalFocusRef = useRef(null)
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })

  const { onSubmit, isLoading, response, isSigning, signLoadingText } =
    useCreateRole()

  const defaultValues = {
    guildId: id,
    name: "",
    description: "",
    logic: "AND",
    requirements: [],
    roleType: "NEW",
    imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
    rolePlatforms: discordPlatform
      ? [
          {
            guildPlatformId: discordPlatform.id,
            platformRoleData: {},
            platformRoleId: null,
          },
        ]
      : [],
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

  const isTwitterRequirementSet = formRequirements.some((formReq) =>
    formReq?.type?.startsWith("TWITTER")
  )
  const { authData, isAuthenticating, onOpen: onTwitterAuthOpen } = useTwitterAuth()

  const { platformUsers, mutate } = useUser()
  const isTwitterConnected = platformUsers?.some(
    ({ platformName }) => platformName === "TWITTER"
  )

  const fetcherWithSign = useFetcherWithSign()
  const user = useUser()
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
        <Button
          ref={finalFocusRef}
          variant="ghost"
          size="sm"
          leftIcon={<Icon as={Plus} />}
          onClick={onOpen}
          data-dd-action-name={
            localStep === null ? "Add role" : "Add role [onboarding]"
          }
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
                <Section
                  title="Platforms"
                  spacing="6"
                  mb={5}
                  titleRightElement={
                    <HStack flexGrow={1} justifyContent={"end"}>
                      <AddPlatformButton />
                    </HStack>
                  }
                >
                  <RolePlatforms isNewRole={true} />
                </Section>

                <Section title={"General"} spacing="6">
                  <Box>
                    <FormLabel>Choose a logo and name for your role</FormLabel>
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

export default AddRoleButton
