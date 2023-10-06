import {
  Circle,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import DisplayCard from "components/common/DisplayCard"
import Image from "next/image"
import { CheckCircle, IconProps } from "phosphor-react"
import platforms from "platforms/platforms"
import { ComponentType, RefAttributes } from "react"
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
  isSelected?: boolean
  onSelection: (platform: PlatformName) => void
} & Rest

const MultiPlatformSelectButton = ({
  platform,
  title,
  description,
  imageUrl,
  icon,
  isSelected,
  onSelection,
  ...rest
}: Props) => {
  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useWeb3ConnectionManager()

  const { onConnect, isLoading, loadingText } = useConnectPlatform(
    platform,
    () => onSelection(platform),
    false,
    "creation"
  )

  const selectPlatform = () => onSelection(platform)

  const user = useUser()
  const isPlatformConnected =
    !platforms[platform].oauth ||
    user.platformUsers?.some(
      ({ platformName, platformUserData }) =>
        platformName === platform && !platformUserData?.readonly
    )

  const circleBgColor = useColorModeValue("gray.700", "gray.600")

  return (
    <DisplayCard
      cursor="pointer"
      onClick={
        !account
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
        {isSelected && (
          <Icon as={CheckCircle} weight="fill" boxSize={6} color={"green.500"} />
        )}
      </HStack>
    </DisplayCard>
  )
}

export default MultiPlatformSelectButton
