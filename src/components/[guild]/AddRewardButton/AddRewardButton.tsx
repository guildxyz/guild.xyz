import {
  FormLabel,
  HStack,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { ArrowLeft, Plus } from "phosphor-react"
import platforms, { PlatformUsageRestrictions } from "platforms/platforms"
import { useRef, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformName } from "types"
import AddPoapPanel from "../CreatePoap"
import useGuild from "../hooks/useGuild"
import AddDiscordPanel from "../RolePlatforms/components/AddRoleRewardModal/components/AddDiscordPanel"
import AddGithubPanel from "../RolePlatforms/components/AddRoleRewardModal/components/AddGithubPanel"
import AddGooglePanel from "../RolePlatforms/components/AddRoleRewardModal/components/AddGooglePanel"
import AddTelegramPanel from "../RolePlatforms/components/AddRoleRewardModal/components/AddTelegramPanel"
import RoleSelector from "../RoleSelector"
import { useIsTabsStuck } from "../Tabs/Tabs"
import { useThemeContext } from "../ThemeContext"
import useAddReward from "./hooks/useAddReward"

const addPlatformComponents: Record<
  Exclude<PlatformName, "" | "TWITTER" | "CONTRACT_CALL" | "TWITTER_V1">,
  (props) => JSX.Element
> = {
  DISCORD: AddDiscordPanel,
  TELEGRAM: AddTelegramPanel,
  GITHUB: AddGithubPanel,
  GOOGLE: AddGooglePanel,
  POAP: AddPoapPanel,
}

const AddRewardButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const methods = useForm()
  const { roles } = useGuild()
  const modalRef = useRef(null)

  const [selection, setSelectionOg] = useState<PlatformName>(null)
  const [showRoleSelect, setShowRoleSelect] = useState(false)

  const AddPlatformPanel = addPlatformComponents[selection]

  const scrollToTop = () => modalRef.current?.scrollTo({ top: 0 })

  const setSelection = (platform: PlatformName) => {
    setSelectionOg(platform)
    scrollToTop()
  }

  const goBack = () => {
    methods.reset()
    if (showRoleSelect) setShowRoleSelect(false)
    else setSelection(null)
  }

  const onSuccess = () => {
    onClose()
    setShowRoleSelect(false)
    setSelection(null)
    methods.reset()
  }
  const { onSubmit, isLoading } = useAddReward(onSuccess)

  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

  return (
    <>
      <Button
        leftIcon={<Plus />}
        onClick={onOpen}
        variant="ghost"
        size="sm"
        {...(!isStuck && {
          color: textColor,
          colorScheme: buttonColorScheme,
        })}
      >
        Add reward
      </Button>
      <FormProvider {...methods}>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="4xl"
          scrollBehavior="inside"
          colorScheme="dark"
        >
          <ModalOverlay />
          <ModalContent minH="550px">
            {!selection && <ModalCloseButton />}
            <ModalHeader>
              <HStack>
                {selection !== null && (
                  <IconButton
                    rounded="full"
                    aria-label="Back"
                    size="sm"
                    mb="-3px"
                    icon={<ArrowLeft size={20} />}
                    variant="ghost"
                    onClick={goBack}
                  />
                )}
                <Text>
                  Add {(selection === null && "reward") || platforms[selection].name}
                </Text>
              </HStack>
            </ModalHeader>
            <ModalBody ref={modalRef}>
              {selection === null ? (
                <PlatformsGrid onSelection={setSelection} showPoap />
              ) : showRoleSelect ? (
                <>
                  <FormLabel mb="4">{`Select ${
                    platforms[selection].usageRestriction ===
                    PlatformUsageRestrictions.SINGLE_ROLE
                      ? "a role"
                      : "role(s)"
                  } to add reward to`}</FormLabel>
                  <RoleSelector
                    allowMultiple={
                      platforms[selection].usageRestriction !==
                      PlatformUsageRestrictions.SINGLE_ROLE
                    }
                    roles={roles}
                    onChange={(selectedRoleIds) =>
                      methods.setValue("roleIds", selectedRoleIds)
                    }
                    size="lg"
                  />
                </>
              ) : (
                <AddPlatformPanel
                  onSuccess={
                    selection === "POAP" ? onSuccess : () => setShowRoleSelect(true)
                  }
                  scrollToTop={scrollToTop}
                  skipSettings
                />
              )}
            </ModalBody>
            {showRoleSelect && (
              <ModalFooter>
                <Button
                  colorScheme="green"
                  onClick={methods.handleSubmit(onSubmit)}
                  isLoading={isLoading}
                >
                  Add reward
                </Button>
              </ModalFooter>
            )}
          </ModalContent>
        </Modal>
      </FormProvider>
    </>
  )
}

export default AddRewardButton
