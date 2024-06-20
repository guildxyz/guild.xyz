import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import Color from "color"
import ColorThief from "colorthief/dist/color-thief.mjs"
import Button from "components/common/Button"
import Card from "components/common/Card"
import FormErrorMessage from "components/common/FormErrorMessage"
import usePinata from "hooks/usePinata"
import { useFormContext } from "react-hook-form"
import IconSelector from "./IconSelector"
import Name from "./Name"
import useCreateGuild from "./hooks/useCreateGuild"

export type CreateGuildFormType = Pick<
  Schemas["GuildCreationPayload"],
  "name" | "imageUrl" | "contacts" | "theme"
>

const getColorByImage = (imageUrl: string) =>
  new Promise<string>((resolve, _) => {
    const colorThief = new ColorThief()

    const imgEl = document.createElement("img")
    imgEl.src = imageUrl
    imgEl.width = 64
    imgEl.height = 64
    imgEl.crossOrigin = "anonymous"

    imgEl.addEventListener("load", () => {
      const dominantRgbColor = colorThief.getColor(imgEl)
      const dominantHexColor = Color.rgb(dominantRgbColor).hex()
      resolve(dominantHexColor)
    })
  })

const CreateGuildForm = () => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useFormContext<CreateGuildFormType>()

  const iconUploader = usePinata({
    fieldToSetOnSuccess: "imageUrl",
    fieldToSetOnError: "imageUrl",
    control,
  })

  const { onSubmit, isLoading } = useCreateGuild()

  return (
    <Card py={6} px={{ base: 5, md: 6 }} position="relative" overflow="hidden">
      <Stack spacing={8}>
        <FormControl isRequired>
          <FormLabel>Logo and name</FormLabel>
          <HStack alignItems="start">
            <IconSelector
              uploader={iconUploader}
              minW={512}
              minH={512}
              onGeneratedBlobChange={async (objectURL) => {
                const generatedThemeColor = await getColorByImage(objectURL)
                setValue("theme.color", generatedThemeColor)
              }}
            />
            <Name width="full" />
          </HStack>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.contacts?.[0]?.contact}>
          <FormLabel>E-mail address</FormLabel>
          <FormHelperText mb={4}>Only visible to the Guild Team</FormHelperText>
          <Input
            {...register("contacts.0.contact", {
              required: "This field is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid e-mail format",
              },
            })}
            size="lg"
          />
          <FormErrorMessage>
            {errors.contacts?.[0]?.contact?.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          colorScheme="green"
          ml="auto"
          size="lg"
          w="full"
          isLoading={isLoading}
          loadingText="Creating guild"
          onClick={handleSubmit(onSubmit)}
        >
          Create guild
        </Button>
      </Stack>
    </Card>
  )
}

export default CreateGuildForm
