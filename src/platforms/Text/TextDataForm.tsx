import { FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import PhotoUploader from "components/create-guild/IconSelector/components/PhotoUploader"
import RichTextDescriptionEditor from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/components/RichTextDescriptionEditor"
import usePinata from "hooks/usePinata"
import { PropsWithChildren } from "react"
import { useFormContext, useWatch } from "react-hook-form"

export type TextRewardForm = {
  name: string
  imageUrl?: string
  // TODO: we'll implement capacity in a new PR
  capacity?: number
  text: string
}

const TextDataForm = ({ children }: PropsWithChildren<unknown>) => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<TextRewardForm>()

  const text = useWatch({ name: "text" })

  const uploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`, {
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

      {/* <FormControl maxW="sm">
        <FormLabel>Capacity</FormLabel>

        <Controller
          name="capacity"
          control={control}
          rules={{
            min: {
              value: 1,
              message: "Must be greater than 0",
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumberInput
              ref={ref}
              value={value ?? ""}
              onChange={(_, valueAsNumber) =>
                onChange(isNaN(valueAsNumber) ? undefined : valueAsNumber)
              }
              onBlur={onBlur}
              min={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />

        <FormHelperText>TODO: explain what capacity means</FormHelperText>
      </FormControl> */}

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

      {children}
    </Stack>
  )
}
export default TextDataForm
