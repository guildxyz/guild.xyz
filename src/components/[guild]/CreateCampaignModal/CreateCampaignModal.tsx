import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Modal } from "components/common/Modal"
import IconSelector from "components/create-guild/IconSelector"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import { ArrowRight } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import useCreateRoleGroup from "./hooks/useCreateRoleGroup"

type Props = { isOpen: boolean; onClose: () => void }

export type CreateCampaignForm = {
  imageUrl?: string
  name: string
  description?: string
}

const CreateCampaignModal = (props: Props) => {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useFormContext<CreateCampaignForm>()

  const iconUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`, {
        shouldTouch: true,
      })
    },
  })

  const { onSubmit, isLoading } = useCreateRoleGroup()

  const { handleSubmit: handleSubmitWithUpload, uploadLoadingText } =
    useSubmitWithUpload(handleSubmit(onSubmit), iconUploader.isUploading)

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create campaign</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Logo and title</FormLabel>
              <HStack spacing={2} alignItems="start">
                <IconSelector uploader={iconUploader} boxSize={10} />

                <Stack spacing={0} w="full">
                  <Input
                    {...register("name", {
                      required: "This field is required",
                    })}
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </Stack>
              </HStack>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Optional"
                {...register("description")}
              ></Textarea>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter pt={0}>
          <Button
            colorScheme="green"
            rightIcon={<ArrowRight />}
            h={10}
            variant="solid"
            onClick={handleSubmitWithUpload}
            isLoading={iconUploader.isUploading || isLoading}
            loadingText={uploadLoadingText || "Creating campaign"}
          >
            Create & set roles
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default CreateCampaignModal
