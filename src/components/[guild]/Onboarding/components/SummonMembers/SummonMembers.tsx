import {
  FormControl,
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
import { useRumAction } from "@datadog/rum-react-integration"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Modal } from "components/common/Modal"
import EntryChannel from "components/create-guild/EntryChannel"
import useGuild from "components/[guild]/hooks/useGuild"
import useDebouncedState from "hooks/useDebouncedState"
import useServerData from "hooks/useServerData"
import React, { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import PaginationButtons from "../PaginationButtons"
import PanelBody from "./components/PanelBody"
import PanelButton from "./components/PanelButton"
import useSendJoin from "./hooks/useSendJoin"

type Props = {
  activeStep: number
  prevStep: () => void
  nextStep: () => void
}

export type SummonMembersForm = {
  channelId: string
  title: string
  description: string
  button: string
}

const SummonMembers = ({ activeStep, prevStep, nextStep }: Props) => {
  const addDatadogAction = useRumAction("trackingAppAction")

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { platforms, description, name } = useGuild()
  const {
    data: { channels },
  } = useServerData(platforms?.[0]?.platformId)

  const methods = useForm<SummonMembersForm>({
    mode: "onSubmit",
    defaultValues: {
      title: "Verify your wallet",
      description: description || "Join this guild and get your role(s)!",
      button: `Join ${name ?? "Guild"}`,
      channelId: "0",
    },
  })

  const { isLoading, isSigning, onSubmit } = useSendJoin(nextStep)

  const loadingText = useMemo(() => {
    if (isSigning) return "Check your wallet"
    return "Sending"
  }, [isSigning])

  const handleClose = () => {
    methods.reset()
    onClose()
  }

  const isDirty = useDebouncedState(methods.formState.isDirty)

  useEffect(() => {
    if (!isDirty) return
    addDatadogAction("modified dc embed")
  }, [isDirty])

  return (
    <>
      <Text>
        If you're satisfied with everything, it's time to invite your community to
        join!
      </Text>
      <PaginationButtons
        activeStep={activeStep}
        prevStep={prevStep}
        nextStep={onOpen}
        nextLabel="Send Discord join button"
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="md">
          <ModalHeader>Send Discord join button</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="8">
              The bot will send a join button as an entry point for Discord users to
              join your guild. Feel free to customize it below!
            </Text>

            <FormProvider {...methods}>
              <EntryChannel
                channels={channels}
                label="Channel to send to"
                tooltip="Users won't be able to send messages here so the button doesn't get spammed away"
                showCreateOption
                maxW="sm"
                withAction
              />

              <FormControl
                isInvalid={!!Object.keys(methods.formState.errors).length}
              >
                <FormLabel mt="6">
                  Customize panel & button text{" "}
                  <Text as="span" color="gray" fontWeight={"normal"} fontSize="sm">
                    (click to edit)
                  </Text>
                </FormLabel>
                <PanelBody />
                <PanelButton />
                <FormErrorMessage>Some fields are empty</FormErrorMessage>
              </FormControl>
            </FormProvider>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={handleClose}
              mr="2"
              data-dd-action-name="Cancel [discord join button]"
            >
              Cancel
            </Button>
            <Button
              colorScheme="primary"
              onClick={methods.handleSubmit((data) => {
                addDatadogAction("click on Send [discord join button]")
                onSubmit(data)
              }, console.log)}
              isLoading={isLoading || isSigning}
              loadingText={loadingText}
              isDisabled={isLoading || isSigning}
            >
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SummonMembers
