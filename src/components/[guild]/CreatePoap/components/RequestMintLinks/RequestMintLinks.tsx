import {
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Modal } from "components/common/Modal"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useCreatePoapContext } from "../CreatePoapContext"

// https://documentation.poap.tech/reference/postredeem-requests

type RequestMintLinksForm = {
  event_id: number
  requested_codes: number
  secret_code: number
  redeem_type: string
}

const RequestsMintLinks = (): JSX.Element => {
  const { poapData } = useCreatePoapContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const methods = useForm<RequestMintLinksForm>({ mode: "all" })
  const {
    register,
    setValue,
    formState: { errors },
  } = methods

  useEffect(() => {
    if (!poapData?.id) return
    setValue("redeem_type", "qr_code")
    setValue("event_id", poapData.id)
  }, [poapData])

  return (
    <>
      <Button w="full" h={10} onClick={onOpen}>
        Request more links
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request mint links</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <FormProvider {...methods}>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors?.requested_codes} isRequired>
                  <FormLabel>Requested mint links</FormLabel>

                  <Input
                    {...register("requested_codes", {
                      required: "This field is required.",
                      min: {
                        value: 1,
                        message: "You must request a positive amount of mint links.",
                      },
                    })}
                  />

                  <FormErrorMessage>
                    {errors?.requested_codes?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors?.secret_code} isRequired>
                  <FormLabel>Edit code</FormLabel>
                  <Input
                    {...register("secret_code", {
                      required: "This field is required.",
                    })}
                  />

                  <FormErrorMessage>{errors?.secret_code?.message}</FormErrorMessage>
                </FormControl>
              </Stack>
            </FormProvider>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="indigo">Request</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default RequestsMintLinks
