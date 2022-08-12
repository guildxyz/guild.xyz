import {
  Checkbox,
  FormLabel,
  Heading,
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
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { ArrowLeft, Plus } from "phosphor-react"
import platforms from "platforms"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { PlatformName } from "types"
import useGuild from "./hooks/useGuild"
import MemberCount from "./RoleCard/components/MemberCount"
import AddDiscordPanel from "./RolePlatforms/components/AddRewardModal/components/AddDiscordPanel"
import AddGithubPanel from "./RolePlatforms/components/AddRewardModal/components/AddGithubPanel"
import AddGooglePanel from "./RolePlatforms/components/AddRewardModal/components/AddGooglePanel"
import AddTelegramPanel from "./RolePlatforms/components/AddRewardModal/components/AddTelegramPanel"

const addPlatformComponents: Record<
  Exclude<PlatformName, "" | "TWITTER">,
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

  const goBack = () =>
    showRoleSelect ? setShowRoleSelect(false) : setSelection(null)

  return (
    <>
      <Button leftIcon={<Plus />} onClick={onOpen} variant="ghost">
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
                  <FormLabel mb="4">Select role(s) to add as a reward to</FormLabel>
                  <Stack>
                    {roles.map((role) => (
                      <Card key={role.id}>
                        <Checkbox
                          value={role.id}
                          size="lg"
                          p="6"
                          spacing="0"
                          flexDirection={"row-reverse"}
                          justifyContent="space-between"
                        >
                          <HStack spacing={4}>
                            <GuildLogo
                              imageUrl={role.imageUrl}
                              size={48}
                              iconSize={12}
                            />
                            <Heading as="h3" fontSize="xl" fontFamily="display">
                              {role.name}
                            </Heading>
                            <MemberCount memberCount={role.memberCount} />
                          </HStack>
                        </Checkbox>
                      </Card>
                    ))}
                  </Stack>
                </>
              ) : (
                <AddPlatformPanel onSuccess={() => setShowRoleSelect(true)} />
              )}
            </ModalBody>
            {showRoleSelect && (
              <ModalFooter>
                <Button colorScheme="green">Add reward</Button>
              </ModalFooter>
            )}
          </ModalContent>
        </Modal>
      </FormProvider>
    </>
  )
}

export default AddRewardButton
