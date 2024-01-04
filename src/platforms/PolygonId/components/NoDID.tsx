import {
  Alert,
  AlertDescription,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalHeader,
  Spacer,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useSubmitWithSign } from "hooks/useSubmit"
import { Stack } from "phosphor-react"
import { useForm, useWatch } from "react-hook-form"
import { mutate } from "swr"
import fetcher from "utils/fetcher"

const NoDID = () => {
  const { id } = useUser()
  const { isLoading, onSubmit, error } = useSubmitWithSign(
    (signedValidation) =>
      fetcher(`${process.env.NEXT_PUBLIC_POLYGONID_API}/v1/polygon-id/connect`, {
        method: "POST",
        ...signedValidation,
      }),
    {
      onSuccess: () => {
        mutate(`${process.env.NEXT_PUBLIC_POLYGONID_API}/v1/users/${id}/polygon-id`)
      },
    }
  )
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm({ defaultValues: { did: "" } })

  const DID = useWatch({ name: "did", control })

  return (
    <>
      <ModalHeader pb={0}>Connect PolygonID</ModalHeader>
      <ModalBody pt={8}>
        {error && (
          <Alert status="error" pb={5} alignItems={"center"} mb={5}>
            <AlertIcon />
            <Stack>
              <AlertDescription
                position="relative"
                top={0.5}
                fontWeight="semibold"
                pr="4"
              >
                Connecting your DID with the Guild has failed.
              </AlertDescription>
            </Stack>
            <Spacer />
          </Alert>
        )}
        <FormControl isRequired isInvalid={!!errors?.did}>
          <FormLabel>Paste your DID</FormLabel>
          <Input
            {...register("did", {
              required: "This field is required",
            })}
          />
          <FormErrorMessage>{errors?.did?.message}</FormErrorMessage>
        </FormControl>
        <Button
          isDisabled={DID === ""}
          colorScheme="green"
          mt={8}
          ml="auto"
          isLoading={isLoading}
          loadingText={"Connecting..."}
          onClick={handleSubmit(({ did }) => onSubmit({ data: did, userId: id }))}
        >
          Connect
        </Button>
      </ModalBody>
    </>
  )
}

export default NoDID
