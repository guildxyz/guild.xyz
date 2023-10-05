import { Box, FormControl, FormLabel, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import RichTextDescriptionEditor from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/components/RichTextDescriptionEditor"
import { PropsWithChildren } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import BoxIcon from "static/icons/box.svg"
import PublicRewardDataForm from "./components/PublicRewardDataForm"

export type SecretTextRewardForm = {
  name: string
  imageUrl?: string
  text: string
}

const SecretTextDataForm = ({ children }: PropsWithChildren<unknown>) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<SecretTextRewardForm>()

  const text = useWatch({ name: "text" })

  return (
    <Stack spacing={8}>
      <PublicRewardDataForm defaultIcon={BoxIcon} />

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
