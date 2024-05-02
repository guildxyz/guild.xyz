import {
  Circle,
  Heading,
  HStack,
  Icon,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { walletSelectorModalAtom } from "components/_app/Web3ConnectionManager/components/WalletSelectorModal"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import DisplayCard from "components/common/DisplayCard"
import CreateGuildContractCall from "components/create-guild/MultiPlatformGrid/components/CreateGuildContractCall"
import CreateGuildDiscord from "components/create-guild/MultiPlatformGrid/components/CreateGuildDiscord"
import CreateGuildGithub from "components/create-guild/MultiPlatformGrid/components/CreateGuildGithub"
import CreateGuildGoogle from "components/create-guild/MultiPlatformGrid/components/CreateGuildGoogle"
import CreateGuildSecretText from "components/create-guild/MultiPlatformGrid/components/CreateGuildSecretText"
import CreateGuildTelegram from "components/create-guild/MultiPlatformGrid/components/CreateGuildTelegram"
import CreateGuildTwitter from "components/create-guild/MultiPlatformGrid/components/CreateGuildTwitter"
import CreateGuildUniqueText from "components/create-guild/MultiPlatformGrid/components/CreateGuildUniqueText"
import { useSetAtom } from "jotai"
import Image from "next/image"
import { CheckCircle, IconProps } from "phosphor-react"
import rewards from "platforms/rewards"
import { ComponentType, RefAttributes } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, PlatformName, Rest } from "types"

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

const createGuildPlatformComponents: Record<
  Exclude<
    PlatformName,
    | "POAP"
    | "TWITTER_V1"
    | "EMAIL"
    | "POLYGON_ID"
    | "POINTS"
    | "FORM"
    | "GATHER_TOWN"
    | "ERC20"
  >,
  (props: { isOpen: boolean; onClose: () => void }) => JSX.Element
> = {
  DISCORD: CreateGuildDiscord,
  TELEGRAM: CreateGuildTelegram,
  GOOGLE: CreateGuildGoogle,
  GITHUB: CreateGuildGithub,
  CONTRACT_CALL: CreateGuildContractCall,
  TEXT: CreateGuildSecretText,
  TWITTER: CreateGuildTwitter,
  UNIQUE_TEXT: CreateGuildUniqueText,
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
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const methods = useFormContext()
  const { setValue } = useFormContext<GuildFormType>()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const user = useUser()
  const { captureEvent } = usePostHogContext()

  const { onConnect, isLoading, loadingText } = useConnectPlatform(
    platform,
    () => {
      onOpen()
      onSelection(platform)
    },
    false,
    "creation"
  )

  const guildPlatforms = useWatch({ name: "guildPlatforms" })
  const twitterLink = useWatch({ name: "socialLinks.TWITTER" })
  const socialLinks = useWatch({ name: "socialLinks" })

  const removePlatform = (platformName: PlatformName) => {
    methods.setValue(
      "guildPlatforms",
      guildPlatforms.filter(
        (guildPlatform) => guildPlatform.platformName !== platformName
      )
    )
  }

  const isTwitter = platform === "TWITTER"
  const isPlatformConnected =
    !rewards[platform].isPlatform ||
    user.platformUsers?.some(
      ({ platformName, platformUserData }) =>
        platformName === platform && !platformUserData?.readonly
    ) ||
    isTwitter

  const circleBgColor = useColorModeValue("gray.700", "gray.600")

  const isAdded =
    (isTwitter && twitterLink) ||
    guildPlatforms.find((platfomAdded) => platform === platfomAdded.platformName)

  const PlatformModal = createGuildPlatformComponents[platform]

  return (
    <>
      <Tooltip
        label={"Remove platform"}
        hasArrow
        isDisabled={!isAdded}
        placement="top"
      >
        <DisplayCard
          cursor="pointer"
          onClick={
            !isWeb3Connected
              ? () => setIsWalletSelectorModalOpen(true)
              : isPlatformConnected
              ? isAdded
                ? () => {
                    if (isTwitter) {
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      const { TWITTER, ...socialsWithoutTwitter } = socialLinks
                      const hasNoSocialLinks =
                        Object.keys(socialsWithoutTwitter).length <= 0

                      setValue(
                        "socialLinks",
                        hasNoSocialLinks ? undefined : socialsWithoutTwitter
                      )
                    } else {
                      removePlatform(platform)
                      if (platform === "DISCORD") {
                        captureEvent("[discord setup] remove selected server")
                      }
                      captureEvent("guild creation flow > platform removed", {
                        platform,
                      })
                    }
                  }
                : () => {
                    onOpen()
                    onSelection(platform)
                  }
              : onConnect
          }
          h="auto"
          py={6}
          px={5}
          {...rest}
          data-test={`${platform}-select-button${
            isPlatformConnected ? "-connected" : ""
          }`}
        >
          <HStack spacing={4}>
            {imageUrl ? (
              <Circle size="12" pos="relative" overflow="hidden">
                <Image src={imageUrl} alt="Guild logo" fill sizes="3rem" />
              </Circle>
            ) : (
              <Circle
                bgColor={circleBgColor}
                size="12"
                pos="relative"
                overflow="hidden"
              >
                <Icon as={icon} boxSize={5} color={"white"} />
              </Circle>
            )}
            <VStack
              spacing={{ base: 0.5, lg: 1 }}
              alignItems="start"
              w="full"
              maxW="full"
            >
              <Heading
                fontSize={"md"}
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
            {isAdded && (
              <Icon as={CheckCircle} weight="fill" boxSize={6} color={"green.500"} />
            )}
          </HStack>
        </DisplayCard>
      </Tooltip>

      <PlatformModal
        isOpen={isOpen}
        onClose={() => {
          onClose()
          captureEvent("guild creation flow > platform added", { platform })
        }}
      />
    </>
  )
}

export default MultiPlatformSelectButton
