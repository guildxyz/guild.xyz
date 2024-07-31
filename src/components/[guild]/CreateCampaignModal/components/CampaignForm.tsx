import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import Switch from "components/common/Switch"
import IconSelector from "components/create-guild/IconSelector"
import { GUILD_NAME_REGEX } from "components/create-guild/Name"
import { Uploader } from "hooks/usePinata/usePinata"
import { ChangeEvent } from "react"
import { useController, useFormContext } from "react-hook-form"

export type CampaignFormType = {
  imageUrl?: string
  name: string
  description?: string
  hideFromGuildPage?: boolean
}

type Props = {
  iconUploader: Uploader
}

const CampaignForm = ({ iconUploader }: Props) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CampaignFormType>()

  const {
    field: {
      value: hideFromGuildPage,
      onChange: hideFromGuildPageOnChange,
      ...hideFromGuildPageField
    },
  } = useController({ control, name: "hideFromGuildPage" })

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
        <Textarea placeholder="Optional" {...register("description")} size="lg" />
      </FormControl>

      <FormControl pt="2">
        <Switch
          {...hideFromGuildPageField}
          title="Show on home page"
          description="If turned off, the page will only be accessible by visiting it's link directly"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            hideFromGuildPageOnChange(!e.target.checked)
          }
          isChecked={!hideFromGuildPage}
        />
      </FormControl>
    </Stack>
  )
}
export default CampaignForm
