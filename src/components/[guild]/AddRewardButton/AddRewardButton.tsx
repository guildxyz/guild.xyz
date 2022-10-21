import {
  FormLabel,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { ArrowLeft, Plus } from "phosphor-react"
import platforms from "platforms"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformName } from "types"
import useGuild from "../hooks/useGuild"
import RoleOptionCard from "../RoleOptionCard"
import AddDiscordPanel from "../RolePlatforms/components/AddRewardModal/components/AddDiscordPanel"
import AddGithubPanel from "../RolePlatforms/components/AddRewardModal/components/AddGithubPanel"
import AddGooglePanel from "../RolePlatforms/components/AddRewardModal/components/AddGooglePanel"
import AddTelegramPanel from "../RolePlatforms/components/AddRewardModal/components/AddTelegramPanel"
import useAddReward from "./hooks/useAddReward"

/**
 * TODO: Add a type "GateablePlatforms", so we can do Record<GateablePlatforms,
 * (props) => JSX.Element> here
 */
const addPlatformComponents: Record<
  Exclude<PlatformName, "" | "TWITTER" | "SPOTIFY">,
  (props) => JSX.Element
> = {
  DISCORD: AddDiscordPanel,
  TELEGRAM: AddTelegramPanel,
  GITHUB: AddGithubPanel,
  GOOGLE: AddGooglePanel,
}

const AddRewardButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const methods = useForm()
  const { roles } = useGuild()

  const [selection, setSelection] = useState<PlatformName>(null)
  const [showRoleSelect, setShowRoleSelect] = useState(false)

  const AddPlatformPanel = addPlatformComponents[selection]

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

  return (
    <>
      <Button leftIcon={<Plus />} onClick={onOpen} variant="ghost" size="sm">
        Add reward
      </Button>
      <FormProvider {...methods}>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="5xl"
          scrollBehavior="inside"
          colorScheme={"dark"}
        >
          <ModalOverlay />
          <ModalContent minH="70vh">
            <ModalHeader>
              <HStack>
                {selection !== null && (
                  <IconButton
                    rounded={"full"}
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
            <ModalBody>
              {selection === null ? (
                <PlatformsGrid
                  onSelection={setSelection}
                  columns={{ base: 1, lg: 2 }}
                />
              ) : showRoleSelect ? (
                <>
                  <FormLabel mb="4">Select role(s) to add reward to</FormLabel>
                  <Stack>
                    {roles.map((role, index) => (
                      <RoleOptionCard
                        key={role.id}
                        role={role}
                        size="lg"
                        {...methods.register(`roleIds.${index}`)}
                      />
                    ))}
                  </Stack>
                </>
              ) : (
                <AddPlatformPanel
                  onSuccess={() => setShowRoleSelect(true)}
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
