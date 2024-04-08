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
import { GUILD_NAME_REGEX } from "components/create-guild/Name"
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
    <Stack spacing={6}>
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>Logo and title</FormLabel>
        <HStack spacing={2} alignItems="start">
          <IconSelector uploader={iconUploader} />

          <Stack spacing={0} w="full">
            <Input
              {...register("name", {
                required: "This field is required",
                maxLength: {
                  value: 50,
                  message: "The maximum possible name length is 50 characters",
                },
                pattern: {
                  value: GUILD_NAME_REGEX,
                  message: "Page name should include at least one letter",
                },
              })}
              size="lg"
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
          size="lg"
        ></Textarea>
      </FormControl>
    </Stack>
  )
}
export default CampaignForm
