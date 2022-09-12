import {
  FormControl,
  FormLabel,
  Grid,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Modal } from "components/common/Modal"
import { useEffect } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { RequestMintLinksForm } from "types"
import { useCreatePoapContext } from "../CreatePoapContext"
import useRequestMintLinks from "./hooks/useRequestMintLinks"

const RequestsMintLinks = (): JSX.Element => {
  const { poapData } = useCreatePoapContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const methods = useForm<RequestMintLinksForm>({ mode: "all" })
  const {
    control,
    register,
    reset,
    setValue,
    formState: { errors },
    handleSubmit,
  } = methods

  useEffect(() => {
    if (!poapData?.id) return
    setValue("redeem_type", "qr_code")
    setValue("event_id", poapData.id)
  }, [poapData])

  const { onSubmit, isLoading, response } = useRequestMintLinks()

  useEffect(() => {
    if (!response) return
    reset({
      event_id: poapData?.id,
      redeem_type: "qr_code",
      requested_codes: undefined,
      secret_code: "",
    })
  }, [response])

  return (
    <>
      {/* <Button w="full" h={10} onClick={onOpen}> */}
      <Tooltip label="Coming soon" shouldWrapChildren>
        <Button w="full" h={10} isDisabled>
          Request more links
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request mint links</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <Stack spacing={4}>
              <FormProvider {...methods}>
                <Grid gap={2} gridTemplateColumns="repeat(2, 1fr)">
                  <FormControl isInvalid={!!errors?.requested_codes} isRequired>
                    <FormLabel>Amount</FormLabel>

                    <Controller
                      name="requested_codes"
                      control={control}
                      defaultValue={0}
                      rules={{
                        required: "This field is required.",
                        min: {
                          value: 0,
                          message: "Must be positive",
                        },
                      }}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <NumberInput
                          ref={ref}
                          value={value ?? undefined}
                          defaultValue={0}
                          onChange={onChange}
                          onBlur={onBlur}
                          min={0}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )}
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

                    <FormErrorMessage>
                      {errors?.secret_code?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Grid>
              </FormProvider>

              <Text color="gray" fontSize="sm">
                The POAP Curation Body will review your petition and you'll receive
                the mint links via e-mail.
              </Text>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="indigo"
              isLoading={isLoading}
              loadingText="Requesting links"
              onClick={handleSubmit(onSubmit)}
            >
              Request
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default RequestsMintLinks
