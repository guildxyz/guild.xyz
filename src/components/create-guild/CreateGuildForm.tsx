import {
  Box,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Stack,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import { DotLottieCommonPlayer, DotLottiePlayer } from "@dotlottie/react-player"
import { Schemas } from "@guildxyz/types"
import Color from "color"
import ColorThief from "colorthief/dist/color-thief.mjs"
import Card from "components/common/Card"
import FormErrorMessage from "components/common/FormErrorMessage"
import usePinata from "hooks/usePinata"
import { useRef } from "react"
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

  return (
    <Card
      pt={12}
      pb={6}
      px={{ base: 5, md: 6 }}
      mb={16}
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
        <CreateGuildAnimation />

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

        <CreateGuildButton />
      </Stack>
    </Card>
  )
}

const CreateGuildAnimation = () => {
  const logoSize = useBreakpointValue({ base: 64, md: 80, lg: 112 })
  const lottiePlayer = useRef<DotLottieCommonPlayer>(null)

  return (
    <Center>
      <Box
        maxW="max-content"
        onMouseEnter={() => {
          lottiePlayer.current?.setDirection(-1)
          lottiePlayer.current?.play()
        }}
        onMouseLeave={() => {
          lottiePlayer.current?.setDirection(1)
          lottiePlayer.current?.play()
        }}
      >
        <DotLottiePlayer
          ref={lottiePlayer}
          autoplay
          speed={1}
          src="/logo.lottie"
          style={{
            marginBottom: 24,
            height: logoSize,
            width: logoSize,
            color: "white",
          }}
        />
      </Box>
    </Center>
  )
}

export default CreateGuildForm
