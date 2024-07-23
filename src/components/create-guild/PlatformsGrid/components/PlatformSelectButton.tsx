import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import {
  Circle,
  HStack,
  Heading,
  Icon,
  Spinner,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import { ArrowSquareIn, CaretRight, IconProps } from "@phosphor-icons/react"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import useUser from "components/[guild]/hooks/useUser"
import DisplayCard from "components/common/DisplayCard"
import { useSetAtom } from "jotai"
import dynamic from "next/dynamic"
import Image from "next/image"
import { ComponentType, RefAttributes, useMemo } from "react"
import rewards from "rewards"
import { PlatformName, Rest } from "types"

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
  disabledText?: string
} & Rest

const PlatformSelectButton = ({
  platform,
  title,
  description,
  imageUrl,
  icon,
  onSelection,
  disabledText,
  ...rest
}: Props) => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  const { onConnect, isLoading, loadingText } = useConnectPlatform(
    platform,
    () => onSelection(platform),
    false,
    "creation"
  )

  const selectPlatform = () => onSelection(platform)

  const user = useUser()
  const isPlatformConnected =
    !rewards[platform].isPlatform ||
    user.platformUsers?.some(
      ({ platformName, platformUserData }) =>
        platformName === platform && !platformUserData?.readonly
    )

  const circleBgColor = useColorModeValue("gray.100", "gray.600")

  const DynamicCtaIcon = useMemo(
    () => dynamic(async () => (!isPlatformConnected ? ArrowSquareIn : CaretRight)),
    [isPlatformConnected]
  )

  return (
    <Tooltip isDisabled={!disabledText} label={disabledText} hasArrow>
      <DisplayCard
        cursor={!!disabledText ? "default" : "pointer"}
        onClick={
          !!disabledText
            ? undefined
            : !isWeb3Connected
              ? () => setIsWalletSelectorModalOpen(true)
              : isPlatformConnected
                ? selectPlatform
                : onConnect
        }
        h="auto"
        {...rest}
        data-test={`${platform}-select-button${
          isPlatformConnected ? "-connected" : ""
        }`}
        opacity={!!disabledText ? 0.5 : 1}
      >
        <HStack spacing={4}>
          {imageUrl ? (
            <Circle
              size="12"
              pos="relative"
              overflow="hidden"
              bgColor={circleBgColor}
            >
              <Image src={imageUrl} alt="Guild logo" fill sizes="3rem" />
            </Circle>
          ) : (
            <Circle
              bgColor={circleBgColor}
              size="12"
              pos="relative"
              overflow="hidden"
            >
              <Icon as={icon} boxSize={5} weight="regular" />
            </Circle>
          )}
          <VStack
            spacing={{ base: 0.5, lg: 1 }}
            alignItems="start"
            w="full"
            maxW="full"
          >
            <Heading
              fontSize="md"
              fontWeight="bold"
              letterSpacing="wide"
              maxW="full"
              noOfLines={1}
            >
              {title}
            </Heading>
            {description && (
              <Text colorScheme="gray" lineHeight={1.33}>
                {(isLoading && `${loadingText}...`) || description}
              </Text>
            )}
          </VStack>
          <Icon
            as={isLoading ? Spinner : isWeb3Connected ? DynamicCtaIcon : CaretRight}
          />
        </HStack>
      </DisplayCard>
    </Tooltip>
  )
}

export default PlatformSelectButton
