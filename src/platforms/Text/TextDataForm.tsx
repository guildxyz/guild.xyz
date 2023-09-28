import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import PhotoUploader from "components/create-guild/IconSelector/components/PhotoUploader"
import RichTextDescriptionEditor from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/components/RichTextDescriptionEditor"
import usePinata from "hooks/usePinata"
import { useFormContext, useWatch } from "react-hook-form"

export type TextRewardForm = {
  name: string
  image?: string
  text: string
}

type Props = {
  buttonLabel?: string
  isLoading?: boolean
  onSubmit?: (data: TextRewardForm) => void
}

const TextDataForm = ({ buttonLabel, isLoading, onSubmit }: Props) => {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useFormContext<TextRewardForm>()

  const name = useWatch({ name: "name" })
  const text = useWatch({ name: "text" })

  const uploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      // TODO: we'll call this imageUrl, and that's great, since the PhotoUploader looks for that field inside the form
      setValue("image", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`, {
        shouldTouch: true,
        shouldValidate: true,
      })
    },
  })

  return (
    <Stack spacing={8}>
      <FormControl isRequired maxW="sm" isInvalid={!!errors?.name}>
        <FormLabel>Reward name</FormLabel>
        <Input {...register("name", { required: "This field is required" })} />
        <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
      </FormControl>

      <PhotoUploader uploader={uploader} />

      <FormControl isRequired isInvalid={!!errors?.text}>
        <FormLabel>Text</FormLabel>
        <RichTextDescriptionEditor
          defaultValue={text}
          onChange={(newValue) => setValue("text", newValue)}
          minHeight="var(--chakra-space-64)"
          placeholder="Type or paste here the text which you'd like to send as reward to your users..."
        />
        <FormErrorMessage>{errors?.text?.message}</FormErrorMessage>
      </FormControl>

      <Button
        colorScheme="indigo"
        isDisabled={!name?.length || !text?.length}
        w="max-content"
        ml="auto"
        onClick={handleSubmit(onSubmit)}
        isLoading={isLoading}
        loadingText="Saving reward"
      >
        {buttonLabel ?? "Continue"}
      </Button>
    </Stack>
  )
}
export default TextDataForm
