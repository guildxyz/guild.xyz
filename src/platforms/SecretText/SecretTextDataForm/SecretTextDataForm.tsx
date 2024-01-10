import { Box, FormControl, FormLabel, Stack, Text } from "@chakra-ui/react"
import RichTextDescriptionEditor from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/components/RichTextDescriptionEditor"
import FormErrorMessage from "components/common/FormErrorMessage"
import { PropsWithChildren } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import BoxIcon from "static/icons/box.svg"
import PublicRewardDataForm from "./components/PublicRewardDataForm"

export type SecretTextRewardForm = {
  name: string
  imageUrl?: string
  text: string
}

type Props = {
  shouldValidate?: boolean
}

const SecretTextDataForm = ({
  shouldValidate = true,
  children,
}: PropsWithChildren<Props>) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<SecretTextRewardForm>()

  useController({
    name: "text",
    rules: {
      maxLength: shouldValidate && {
        value: 10000,
        message: "Max text length is 10000 characters",
      },
      required: shouldValidate && "This field is required",
    },
  })

  const text = useWatch({ name: "text" })

  return (
    <Stack spacing={8}>
      <Text colorScheme="gray" fontWeight="semibold">
        Eligible users will be able to reveal the secret content you set below -
        great for distributing any special info based on roles
      </Text>

      <PublicRewardDataForm defaultIcon={BoxIcon} />

      <Box>
        <FormLabel>Secret content to reveal</FormLabel>
        <FormControl isRequired isInvalid={!!errors?.text}>
          <RichTextDescriptionEditor
            defaultValue={text}
            onChange={(newValue) =>
              setValue("text", newValue, { shouldValidate: true })
            }
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
