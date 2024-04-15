import {
  AspectRatio,
  Box,
  Circle,
  Icon,
  Img,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import { DownloadSimple } from "phosphor-react"
import GuildGhost from "static/avatars/ghost.svg"
import useSWRImmutable from "swr/immutable"
import convertSVGToPNG from "utils/convertSVGToPNG"
import { GuildAction, useMintGuildPinContext } from "../MintGuildPinContext"

const GuildPinImage = (): JSX.Element => {
  const { pinType, pinImage, isInvalidImage, isTooSmallImage } =
    useMintGuildPinContext()
  const { name } = useGuild()
  const { isAdmin } = useGuildPermission()

  const ghostIconColor = useColorModeValue("blackAlpha.300", "whiteAlpha.300")

  const imageShadow = useColorModeValue(
    "10px 10px 20px #d4d4d4, -10px -10px 20px #ffffff;",
    "10px 10px 20px #171719, -10px -10px 20px #37373b;"
  )

  const guildPinDescription: Record<GuildAction, string> = {
    [GuildAction.JOINED_GUILD]: `This is an onchain proof that you joined ${name} on Guild.xyz.`,
    [GuildAction.IS_OWNER]: `This is an onchain proof that you're the owner of ${name} on Guild.xyz.`,
    [GuildAction.IS_ADMIN]: `This is an onchain proof that you're an admin of ${name} on Guild.xyz.`,
  }

  const pinUrl = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${pinImage}`

  return (
    <>
      <Box pos={"relative"} px="16" py="6">
        <AspectRatio ratio={1} position={"relative"}>
          <>
            {pinImage && (
              <Img
                w="full"
                zIndex={1}
                src={pinUrl}
                alt="Guild Pin image"
                borderRadius="full"
                boxShadow={imageShadow}
              />
            )}

            {pinImage && isAdmin && !isInvalidImage && !isTooSmallImage && (
              <DownloadGuildPinImage pinUrl={pinUrl} />
            )}

            <Circle
              position="absolute"
              borderWidth={2}
              borderStyle="dashed"
              p="6"
              // needed so the image covers it entirely
              transform="scale(0.98)"
              boxShadow={imageShadow}
            >
              {isInvalidImage ? (
                <Icon as={GuildGhost} boxSize={16} color={ghostIconColor} />
              ) : (
                <VStack>
                  <Spinner size="lg" />
                  <Text fontWeight="bold" textAlign="center" fontSize="sm">
                    Generating Guild Pin
                  </Text>
                </VStack>
              )}
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

const DownloadGuildPinImage = ({ pinUrl }: { pinUrl: string }): JSX.Element => {
  const { data: imageAsPNG } = useSWRImmutable(
    ["convertSVGToPNG", pinUrl],
    ([_, url]) => convertSVGToPNG(url)
  )

  if (!imageAsPNG) return null

  return (
    <Circle
      as="a"
      href={imageAsPNG}
      target="_blank"
      download="pin.png"
      position="absolute"
      inset={0}
      p="6"
      zIndex="modal"
      opacity={0}
      _hover={{
        opacity: 1,
      }}
      bgColor="blackAlpha.700"
      transition="opacity 0.24s ease"
      cursor="pointer"
      color="white"
    >
      <VStack>
        <Icon as={DownloadSimple} boxSize={8} />
        <Text as="span" fontWeight="semibold" fontSize="sm">
          Download PNG
        </Text>
      </VStack>
    </Circle>
  )
}

export default GuildPinImage
