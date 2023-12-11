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
  const connectPolygonId = useSubmitWithSign(
    () => fetcher("/v1/polygon-id/connect", { method: "POST" }),
    {
      onSuccess: () => {
        mutate(`/v1/users/${id}/polygon-id`)
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
    <form
      onSubmit={handleSubmit(({ did }) =>
        connectPolygonId.onSubmit({ did, userId: id })
      )}
    >
      <ModalHeader pb={0}>Connect PolygonID</ModalHeader>
      <ModalBody pt={8}>
        {connectPolygonId.error && (
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
          type="submit"
          isLoading={connectPolygonId.isLoading}
          loadingText={"connecting..."}
        >
          Connect
        </Button>
      </ModalBody>
    </form>
  )
}

export default NoDID
