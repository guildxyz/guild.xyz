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
import { useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import Card from "components/common/Card"
import { useMintCredentialContext } from "../MintCredentialContext"

const CredentialImage = (): JSX.Element => {
  const { credentialImage, error } = useMintCredentialContext()
  const { name, theme } = useGuild()
  const { textColor } = useThemeContext()
  const { id } = useUser()

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
    <Card mb="8">
      <Box
        pos={"relative"}
        px="16"
        py="6"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          bg: theme?.color ?? "black",
          opacity: "0.5",
        }}
      >
        <AspectRatio ratio={1} position={"relative"}>
          <>
            {credentialImage && (
              <Img
                w="full"
                zIndex={1}
                src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${credentialImage}`}
                alt="Guild Credential image"
                borderRadius="xl"
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
        {"This is an on-chain proof that guild user "}
        <Text as="span" fontWeight={"medium"}>
          #{id}
        </Text>
        {` joined the ${name} guild on Guild.xyz.`}
      </Text>
    </Card>
  )
}

export default CredentialImage
