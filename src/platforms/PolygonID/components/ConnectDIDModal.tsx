import {
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useForm, useWatch } from "react-hook-form"
import fetcher from "utils/fetcher"
import useConnectedDID from "../hooks/useConnectedDID"
import { useMintPolygonIDProofContext } from "./MintPolygonIDProofProvider"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ConnectDIDModal = ({ isOpen, onClose }: Props) => {
  const { id } = useUser()
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm({ defaultValues: { did: "" } })

  const DID = useWatch({ name: "did", control })

  const { onConnectDIDModalClose, onMintPolygonIDProofModalOpen } =
    useMintPolygonIDProofContext()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { mutate } = useConnectedDID()
  const { isLoading, onSubmit } = useSubmitWithSign<{ did: string }>(
    (signedValidation) =>
      fetcher(`${process.env.NEXT_PUBLIC_POLYGONID_API}/v1/polygon-id/connect`, {
        method: "POST",
        ...signedValidation,
      }),
    {
      onSuccess: ({ did: newDID }) => {
        toast({
          status: "success",
          title: "Successfully connected DID",
        })
        mutate(() => newDID, {
          revalidate: false,
        })
        onConnectDIDModalClose()
        onMintPolygonIDProofModalOpen()
      },
      onError: () => showErrorToast("Couldn't connect your DID"),
    }
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} colorScheme={"dark"}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Connect PolygonID</ModalHeader>
        <ModalBody pb={4}>
          <FormControl isRequired isInvalid={!!errors?.did}>
            <FormLabel>Paste your DID</FormLabel>
            <Input
              {...register("did", {
                required: "This field is required",
              })}
            />
            <FormErrorMessage>{errors?.did?.message}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter pt={0}>
          <Button
            isDisabled={!DID}
            colorScheme="green"
            ml="auto"
            isLoading={isLoading}
            loadingText={"Connecting..."}
            onClick={handleSubmit(({ did }) => onSubmit({ data: did, userId: id }))}
          >
            Connect
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ConnectDIDModal
