import {
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
import PaginationButtons from "../PaginationButtons"
import PanelBody from "./components/PanelBody"
import PanelButton from "./components/PanelButton"

type Props = {
  prevStep: () => void
  nextStep: () => void
}

const SummonMembers = ({ prevStep, nextStep }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { platforms, description } = useGuild()
  const methods = useForm({
    mode: "all",
    defaultValues: {
      title: "",
      description: description || "",
      button: "",
    },
  })
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

              <PanelBody />
              <PanelButton />
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
