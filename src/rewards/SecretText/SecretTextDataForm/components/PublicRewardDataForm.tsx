import { Box, FormControl, FormLabel, HStack, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext } from "react-hook-form"
import { UniqueTextRewardForm } from "rewards/UniqueText/UniqueTextDataForm"
import { SecretTextRewardForm } from "../types"
import RewardImagePicker from "./RewardImagePicker"

const PublicRewardDataForm = ({ defaultIcon }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SecretTextRewardForm | UniqueTextRewardForm>()

  return (
    <Box>
      <FormLabel>Display reward publicly as</FormLabel>
      <HStack alignItems="start">
        <RewardImagePicker defaultIcon={defaultIcon} />

        <FormControl isRequired maxW="sm" isInvalid={!!errors?.name}>
          <Input {...register("name", { required: "This field is required" })} />
          <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
        </FormControl>
      </HStack>
    </Box>
  )
}
export default PublicRewardDataForm
