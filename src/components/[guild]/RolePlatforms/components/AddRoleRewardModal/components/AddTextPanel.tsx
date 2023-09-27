import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useGuild from "components/[guild]/hooks/useGuild"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { Visibility } from "types"
import RichTextDescriptionEditor from "./AddContractCallPanel/components/CreateNftForm/components/RichTextDescriptionEditor"

type AddTextRewardForm = {
  name: string
  text: string
}

type Props = {
  onSuccess: () => void
}

const AddTextPanel = ({ onSuccess }: Props) => {
  const { id: guildId } = useGuild()

  const methods = useForm<AddTextRewardForm>({ mode: "all" })
  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = methods
  const name = useWatch({ control: control, name: "name" })
  const text = useWatch({ control: control, name: "text" })

  const roleVisibility: Visibility = useWatch({ name: ".visibility" })
  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const onContinue = (data: AddTextRewardForm) => {
    append({
      guildPlatform: {
        platformName: "TEXT",
        platformGuildId: `text-${guildId}-${Date.now()}`,
        platformGuildData: {
          text: data.text,
          name: data.name,
        },
      },
      isNew: true,
      visibility: roleVisibility,
    })
    onSuccess()
  }

  return (
    <Stack spacing={4}>
      <FormControl isRequired maxW="sm" isInvalid={!!errors?.name}>
        <FormLabel>Reward name</FormLabel>
        <Input
          {...methods.register("name", { required: "This field is required" })}
        />
        <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors?.text}>
        <FormLabel>Text</FormLabel>
        <RichTextDescriptionEditor
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
        onClick={handleSubmit(onContinue)}
      >
        Continue
      </Button>
    </Stack>
  )
}
export default AddTextPanel
