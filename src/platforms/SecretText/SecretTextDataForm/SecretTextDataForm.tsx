import { Box, FormControl, FormLabel, HStack, Input, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import RichTextDescriptionEditor from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/components/RichTextDescriptionEditor"
import { PropsWithChildren } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import RewardImagePicker from "./components/RewardImagePicker"

export type SecretTextRewardForm = {
  name: string
  imageUrl?: string
  text: string
}

const SecretTextDataForm = ({ children }: PropsWithChildren<unknown>) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<SecretTextRewardForm>()

  const text = useWatch({ name: "text" })

  return (
    <Stack spacing={8}>
      <Box>
        <FormLabel>Display reward publicly as</FormLabel>
        <HStack alignItems="start">
          <RewardImagePicker />

          <FormControl isRequired maxW="sm" isInvalid={!!errors?.name}>
            <Input {...register("name", { required: "This field is required" })} />
            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
          </FormControl>
        </HStack>
      </Box>

      <Box>
        <FormLabel>Secret content to reveal</FormLabel>
        <FormControl isRequired isInvalid={!!errors?.text}>
          <RichTextDescriptionEditor
            defaultValue={text}
            onChange={(newValue) => setValue("text", newValue)}
            minHeight="var(--chakra-space-64)"
            placeholder="Type or paste here the contents of your secret. You can format it and attach images too!"
          />
          <FormErrorMessage>{errors?.text?.message}</FormErrorMessage>
        </FormControl>
      </Box>

      {children}
    </Stack>
  )
}
export default SecretTextDataForm
