import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  FormLabel,
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
import EntryChannel from "components/create-guild/PickRolePlatform/components/Discord/components/EntryChannel"
import useServerData from "components/create-guild/PickRolePlatform/components/Discord/hooks/useServerData"
import useGuild from "components/[guild]/hooks/useGuild"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import PaginationButtons from "./PaginationButtons"

type Props = {
  prevStep: () => void
  nextStep: () => void
}

const SummonMembers = ({ prevStep, nextStep }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const methods = useForm({
    mode: "all",
  })
  const { platforms, name, description } = useGuild()
  const {
    data: { channels },
  } = useServerData(platforms?.[0]?.platformId)

  return (
    <>
      <Text>
        If you're satisfied with everything it's time to invite your community to
        join!
      </Text>
      <PaginationButtons
        prevStep={prevStep}
        nextStep={onOpen}
        nextLabel="Send join button"
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="md">
          <ModalHeader>Send Discord join button</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="8">
              The bot will send a join panel with which the users will authenticate.
              Customize it below!
            </Text>
            <FormProvider {...methods}>
              <EntryChannel
                channels={channels}
                label="Channel to send to"
                tooltip="Users won't be able to send messages here so the panel doesn't get spammed away"
                showCreateOption
                maxW="sm"
              />
              <FormLabel mt="6">
                Customize panel & button text{" "}
                <Text as="span" color="gray" fontWeight={"normal"} fontSize="sm">
                  (click to edit)
                </Text>
              </FormLabel>
              <Box
                bg="gray.800"
                borderRadius={"4px"}
                p="4"
                borderLeft={"4px solid var(--chakra-colors-DISCORD-500)"}
              >
                <Editable fontWeight={"bold"} defaultValue="Verify your wallet">
                  <EditablePreview />
                  <EditableInput />
                </Editable>
                <Editable
                  fontSize={"sm"}
                  defaultValue={
                    description || "Join this guild and get your role(s)!"
                  }
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              </Box>
              <Box
                bg="DISCORD.500"
                py="1"
                px="4"
                borderRadius={"4px"}
                d="inline-block"
                mt="2"
              >
                <Editable
                  fontSize={"sm"}
                  fontWeight="semibold"
                  defaultValue={`Join ${name}`}
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              </Box>
            </FormProvider>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose} mr="2">
              Cancel
            </Button>
            <Button colorScheme="primary" onClick={nextStep}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SummonMembers
