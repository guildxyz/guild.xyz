import {
  Circle,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { ArrowSquareIn, CaretRight, type IconProps } from "@phosphor-icons/react"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { walletSelectorModalAtom } from "components/_app/Web3ConnectionManager/components/WalletSelectorModal"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import DisplayCard from "components/common/DisplayCard"
import { useSetAtom } from "jotai"
import dynamic from "next/dynamic"
import Image from "next/image"
import rewards from "platforms/rewards"
import { ComponentType, RefAttributes, useMemo } from "react"
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
    "creation",
  )

  const selectPlatform = () => onSelection(platform)

  const user = useUser()
  const isPlatformConnected =
    !rewards[platform].isPlatform ||
    user.platformUsers?.some(
      ({ platformName, platformUserData }) =>
        platformName === platform && !platformUserData?.readonly,
    )

  const circleBgColor = useColorModeValue("gray.700", "gray.600")
  const DynamicCtaIcon = useMemo(
    () => dynamic(async () => (!isPlatformConnected ? ArrowSquareIn : CaretRight)),
    [isPlatformConnected],
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
              <Icon as={icon} boxSize={5} weight="regular" color="white" />
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
              <Text letterSpacing="wide" colorScheme="gray">
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
