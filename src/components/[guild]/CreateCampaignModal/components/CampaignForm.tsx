import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import IconSelector from "components/create-guild/IconSelector"
import { Uploader } from "hooks/usePinata/usePinata"
import { useFormContext } from "react-hook-form"

export type CampaignFormType = {
  imageUrl?: string
  name: string
  description?: string
}

type Props = {
  iconUploader: Uploader
}

const CampaignForm = ({ iconUploader }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CampaignFormType>()

  return (
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
        <Textarea placeholder="Optional" {...register("description")}></Textarea>
      </FormControl>
    </Stack>
  )
}
export default CampaignForm
