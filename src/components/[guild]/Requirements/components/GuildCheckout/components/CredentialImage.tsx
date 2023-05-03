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
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useThemeContext } from "components/[guild]/ThemeContext"
import { GuildAction, useMintCredentialContext } from "../MintCredentialContext"

const CredentialImage = (): JSX.Element => {
  const { credentialType, credentialImage, error } = useMintCredentialContext()
  const { name } = useGuild()
  const { textColor } = useThemeContext()

  const credentialDescription: Record<GuildAction, string> = {
    [GuildAction.JOINED_GUILD]: `This is an on-chain proof that you joined ${name} on Guild.xyz.`,
    [GuildAction.IS_OWNER]: `This is an on-chain proof that you're the owner of ${name} on Guild.xyz.`,
    [GuildAction.IS_ADMIN]: `This is an on-chain proof that you're an admin of ${name} on Guild.xyz.`,
  }

  if (error)
    return (
      <Alert status="error" pb="6" mb="8">
        <AlertIcon />
        <Stack top="1" position="relative" w="full">
          <AlertTitle>Couldn't generate credential</AlertTitle>
          <AlertDescription wordBreak={"break-word"}>{error}</AlertDescription>
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
            {credentialImage && (
              <Img
                w="full"
                zIndex={1}
                src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${credentialImage}`}
                alt="Guild Credential image"
                borderRadius="full"
                boxShadow="10px 10px 20px #171719, -10px -10px 20px #37373b;"
              />
            )}
            <Circle
              position={"absolute"}
              borderWidth={2}
              borderStyle="dashed"
              borderColor={textColor}
              p="6"
              // needed so the image covers it entirely
              transform="scale(0.98)"
            >
              <VStack color={textColor}>
                <Spinner size="lg" />
                <Text fontWeight="bold" textAlign={"center"} fontSize={"sm"}>
                  Generating credential
                </Text>
              </VStack>
            </Circle>
          </>
        </AspectRatio>
      </Box>
      <Text textAlign={"center"} p="4">
        {credentialDescription[credentialType]}
      </Text>
    </>
  )
}

export default CredentialImage
