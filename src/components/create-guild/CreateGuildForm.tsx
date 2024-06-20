import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Stack,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import Color from "color"
import ColorThief from "colorthief/dist/color-thief.mjs"
import Button from "components/common/Button"
import Card from "components/common/Card"
import usePinata from "hooks/usePinata"
import { useFormContext } from "react-hook-form"
import ContactInfo from "./BasicInfo/components/ContactInfo"
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
  const { control, setValue, handleSubmit } = useFormContext<CreateGuildFormType>()

  const iconUploader = usePinata({
    fieldToSetOnSuccess: "imageUrl",
    fieldToSetOnError: "imageUrl",
    control,
  })

  const bgColor = useColorModeValue("white", "var(--chakra-colors-gray-700)")
  const bgFile = useColorModeValue("bg_light.svg", "bg.svg")
  const bg = useBreakpointValue({
    md: `linear-gradient(to right, ${bgColor} 70%, transparent), url('/landing/${bgFile}')`,
  })

  const { onSubmit, isLoading } = useCreateGuild()

  return (
    <Card
      py={6}
      px={{ base: 5, md: 6 }}
      position="relative"
      overflow="hidden"
      bg={bgColor}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg,
        bgSize: "cover",
        bgRepeat: "no-repeat",
        bgPosition: "top 7px right 7px",
        opacity: "0.07",
      }}
    >
      <Stack spacing={8}>
        <FormControl isRequired>
          <FormLabel>Logo and name</FormLabel>
          <HStack alignItems="start" maxW={{ base: "full", sm: "md" }}>
            <IconSelector
              uploader={iconUploader}
              minW={512}
              minH={512}
              onGeneratedBlobChange={async (objectURL) => {
                const generatedThemeColor = await getColorByImage(objectURL)
                setValue("theme.color", generatedThemeColor)
              }}
            />
            <Name />
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Contact info</FormLabel>
          <FormHelperText mb={4}>Only visible to the Guild Team</FormHelperText>
          <ContactInfo />
        </FormControl>

        <Button
          colorScheme="green"
          ml="auto"
          size="lg"
          w={{ base: "full", sm: "max-content" }}
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
