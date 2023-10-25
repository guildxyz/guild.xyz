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

export type RoleGroupFormType = {
  imageUrl?: string
  name: string
  description?: string
}

type Props = {
  iconUploader: Uploader
}

const RoleGroupForm = ({ iconUploader }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RoleGroupFormType>()

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
export default RoleGroupForm
