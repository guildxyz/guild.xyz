import {
  Center,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import Color from "color"
import ColorThief from "colorthief/dist/color-thief.mjs"
import Card from "components/common/Card"
import FormErrorMessage from "components/common/FormErrorMessage"
import usePinata from "hooks/usePinata"
import { useFormContext } from "react-hook-form"
import CreateGuildButton from "./CreateGuildButton"
import IconSelector from "./IconSelector"
import Name from "./Name"

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
  } = useFormContext<CreateGuildFormType>()

  const iconUploader = usePinata({
    fieldToSetOnSuccess: "imageUrl",
    fieldToSetOnError: "imageUrl",
    control,
  })

  const bgColor = useColorModeValue("white", "var(--chakra-colors-gray-700)")
  const bgFile = useColorModeValue("bg_light.svg", "bg.svg")
  const logoSize = useBreakpointValue({ base: 28, md: 40 })

  return (
    <Stack spacing={4} mb={16}>
      <Card
        pt={12}
        pb={8}
        px={{ base: 5, md: 6 }}
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          bg: `radial-gradient(circle at 50% 75%, ${bgColor} 70%, transparent), url('/landing/${bgFile}')`,
          bgSize: "100% auto, 150% auto",
          bgRepeat: "no-repeat",
          bgPosition: "top 0.5rem center",
          opacity: "0.07",
        }}
      >
        <Stack spacing={6}>
          <Center>
            <IconSelector
              uploader={iconUploader}
              minW={512}
              minH={512}
              onGeneratedBlobChange={async (objectURL) => {
                const generatedThemeColor = await getColorByImage(objectURL)
                setValue("theme.color", generatedThemeColor)
              }}
              boxSize={logoSize}
            />
          </Center>

          <FormControl isRequired>
            <FormLabel>Guild name</FormLabel>
            <Name width="full" />
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.contacts?.[0]?.contact}>
            <FormLabel>Your email</FormLabel>
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
        </Stack>
      </Card>
      <CreateGuildButton />
    </Stack>
  )
}

export default CreateGuildForm
