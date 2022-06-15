import {
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import useServerData from "hooks/useServerData"
import { useEffect, useMemo } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { useRolePlatrform } from "../../../RolePlatformProvider"
import ChannelsToGate from "./components/ChannelsToGate"
import { GatedChannels } from "./components/ChannelsToGate/components/Category"
import RoleToManage from "./components/RoleToManage"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
}

const EditModal = ({ isOpen, onClose }: ModalProps) => (
  <ChakraModal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Discord Settings</ModalHeader>
      <ModalBody>
        <ChannelsToGate />
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="green" onClick={onClose}>
          Done
        </Button>
      </ModalFooter>
    </ModalContent>
  </ChakraModal>
)

const EditModalForNewPlatform = ({ isOpen, onClose }: ModalProps) => (
  <ChakraModal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent minW={"3xl"}>
      <ModalHeader>Discord Settings</ModalHeader>
      <ModalBody>
        <VStack spacing={5} alignItems="start">
          <RoleToManage />
          <ChannelsToGate />
        </VStack>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="green" onClick={onClose}>
          Done
        </Button>
      </ModalFooter>
    </ModalContent>
  </ChakraModal>
)

const BaseLabel = ({ isAdded = false }: { isAdded?: boolean }) => {
  const { nativePlatformId, discordRoleId } = useRolePlatrform()
  const { authorization } = useDCAuth("guilds")

  const {
    data: { categories },
  } = useServerData(nativePlatformId, { authorization })

  const gatedChannels = useWatch<{ gatedChannels: GatedChannels }>({
    name: "gatedChannels",
    defaultValue: {},
  })

  const numOfGatedChannels = useMemo(
    () =>
      Object.values(gatedChannels)
        .flatMap(
          ({ channels }) =>
            Object.values(channels).map(({ isChecked }) => +isChecked) ?? []
        )
        .reduce((acc, curr) => acc + curr, 0),
    [gatedChannels]
  )

  const { setValue } = useFormContext()
  const { touchedFields } = useFormState()

  useEffect(() => {
    if (!categories || categories.length <= 0) return

    setValue(
      "gatedChannels",
      Object.fromEntries(
        categories.map(({ channels, id, name }) => [
          id,
          {
            name,
            channels: Object.fromEntries(
              (channels ?? []).map((channel) => [
                channel.id,
                {
                  name: channel.name,
                  isChecked: touchedFields.gatedChannels?.[id]?.channels?.[
                    channel.id
                  ]
                    ? gatedChannels?.[id]?.channels?.[channel.id]?.isChecked
                    : channel.roles.includes(discordRoleId),
                },
              ])
            ),
          },
        ])
      )
    )
  }, [categories, discordRoleId])

  return (
    <Text>
      {isAdded && "Create a new role, "}
      {authorization && numOfGatedChannels > 0 ? numOfGatedChannels : ""} gated
      channel
      {numOfGatedChannels === 1 ? "" : "s"}
    </Text>
  )
}

const Label = () => <BaseLabel />
const LabelForNewPlatform = () => <BaseLabel isAdded />

const EditDiscordPlatform = {
  EditModal,
  Label,
  NewPlatform: { Label: LabelForNewPlatform, EditModal: EditModalForNewPlatform },
}

export default EditDiscordPlatform
