import {
  Circle,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import DisplayCard from "components/common/DisplayCard"
import Image from "next/image"
import { CheckCircle, IconProps } from "phosphor-react"
import platforms from "platforms/platforms"
import { ComponentType, RefAttributes } from "react"
import { useWatch } from "react-hook-form"
import { PlatformName, Rest } from "types"
import { useAccount } from "wagmi"

export type PlatformHookType = ({
  platform,
  onSelection,
}: {
  platform: PlatformName
  onSelection: (platform: PlatformName) => void
}) => {
  onClick: () => void
  isLoading: boolean
  loadingText: string
  rightIcon: ComponentType<IconProps & RefAttributes<SVGSVGElement>>
}

type Props = {
  platform: PlatformName
  hook?: PlatformHookType
  title: string
  description?: string
  imageUrl?: string
  icon?: ComponentType<IconProps & RefAttributes<SVGSVGElement>>
  onSelection: (platform: PlatformName) => void
} & Rest

const MultiPlatformSelectButton = ({
  platform,
  title,
  description,
  imageUrl,
  icon,
  onSelection,
  ...rest
}: Props) => {
  const { address } = useAccount()
  const { openWalletSelectorModal } = useWeb3ConnectionManager()

  const { onConnect, isLoading, loadingText } = useConnectPlatform(
    platform,
    () => onSelection(platform),
    false,
    "creation"
  )

  const guildPlatforms = useWatch({ name: "guildPlatforms" })
  const twitterLink = useWatch({ name: "socialLinks.TWITTER" })

  const selectPlatform = () => onSelection(platform)

  const user = useUser()
  const isPlatformConnected =
    !platforms[platform].oauth ||
    user.platformUsers?.some(
      ({ platformName, platformUserData }) =>
        platformName === platform && !platformUserData?.readonly
    ) ||
    platform === "TWITTER"

  const circleBgBaseColor = useColorModeValue("gray.700", "gray.600")
  const circleBgColor = platform === "TWITTER" ? "white" : circleBgBaseColor

  const isDone = () => {
    const platformAddedToGuild = guildPlatforms.find(
      (platfomAdded) => platform === platfomAdded.platformName
    )

    if (platform === "TWITTER") {
      if (twitterLink) {
        return true
      } else {
        return false
      }
    }

    return platformAddedToGuild
  }

  return (
    <DisplayCard
      cursor="pointer"
      onClick={
        !address
          ? openWalletSelectorModal
          : isPlatformConnected
          ? selectPlatform
          : onConnect
      }
      h="auto"
      {...rest}
      data-test={`${platform}-select-button${
        isPlatformConnected ? "-connected" : ""
      }`}
    >
      <HStack spacing={4}>
        {imageUrl ? (
          <Circle size="12" pos="relative" overflow="hidden">
            <Image src={imageUrl} alt="Guild logo" layout="fill" />
          </Circle>
        ) : (
          <Circle bgColor={circleBgColor} size="12" pos="relative" overflow="hidden">
            <Icon
              as={icon}
              boxSize={platform === "TWITTER" ? 8 : 5}
              weight={platform === "TWITTER" ? "fill" : "regular"}
              color={platform === "TWITTER" ? "#26a7de" : "white"}
            />
          </Circle>
        )}
        <VStack
          spacing={{ base: 0.5, lg: 1 }}
          alignItems="start"
          w="full"
          maxW="full"
        >
          <Heading
            fontSize={{ lg: "lg" }}
            fontWeight="bold"
            letterSpacing="wide"
            maxW="full"
            noOfLines={1}
          >
            {title}
          </Heading>
          {description && (
            <Text letterSpacing="wide" colorScheme="gray">
              {(isLoading && `${loadingText}...`) || description}
            </Text>
          )}
        </VStack>
        {isDone() && (
          <Icon as={CheckCircle} weight="fill" boxSize={6} color={"green.500"} />
        )}
      </HStack>
    </DisplayCard>
  )
}

export default MultiPlatformSelectButton
