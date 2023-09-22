import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AspectRatio,
  Box,
  Circle,
  Img,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { GuildAction, useMintGuildPinContext } from "../MintGuildPinContext"

const GuildPinImage = (): JSX.Element => {
  const { pinType, pinImage, error } = useMintGuildPinContext()
  const { name } = useGuild()

  const imageShadow = useColorModeValue(
    "10px 10px 20px #d4d4d4, -10px -10px 20px #ffffff;",
    "10px 10px 20px #171719, -10px -10px 20px #37373b;"
  )

  const guildPinDescription: Record<GuildAction, string> = {
    [GuildAction.JOINED_GUILD]: `This is an on-chain proof that you joined ${name} on Guild.xyz.`,
    [GuildAction.IS_OWNER]: `This is an on-chain proof that you're the owner of ${name} on Guild.xyz.`,
    [GuildAction.IS_ADMIN]: `This is an on-chain proof that you're an admin of ${name} on Guild.xyz.`,
  }

  if (error)
    return (
      <Alert status="error" pb="6" mb="8">
        <AlertIcon />
        <Stack top="1" position="relative" w="full">
          <AlertTitle>Couldn't generate Guild Pin</AlertTitle>
          <AlertDescription wordBreak={"break-word"}>
            {error?.error}
          </AlertDescription>
        </Stack>
      </Alert>
    )

  return (
    <>
      <Box
        pos={"relative"}
        px="16"
        py="6"
        // _before={{
        //   content: '""',
        //   position: "absolute",
        //   top: 0,
        //   bottom: 0,
        //   left: 0,
        //   right: 0,
        //   bg: theme?.color ?? "black",
        //   opacity: "0.5",
        // }}
      >
        <AspectRatio ratio={1} position={"relative"}>
          <>
            {pinImage && (
              <Img
                w="full"
                zIndex={1}
                src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${pinImage}`}
                alt="Guild Pin image"
                borderRadius="full"
                boxShadow={imageShadow}
              />
            )}
            <Circle
              position={"absolute"}
              borderWidth={2}
              borderStyle="dashed"
              p="6"
              // needed so the image covers it entirely
              transform="scale(0.98)"
              boxShadow={imageShadow}
            >
              <VStack>
                <Spinner size="lg" />
                <Text fontWeight="bold" textAlign={"center"} fontSize={"sm"}>
                  Generating Guild Pin
                </Text>
              </VStack>
            </Circle>
          </>
        </AspectRatio>
      </Box>
      <Text textAlign="center" fontWeight="medium" p="4">
        {guildPinDescription[pinType]}
      </Text>
    </>
  )
}

export default GuildPinImage
