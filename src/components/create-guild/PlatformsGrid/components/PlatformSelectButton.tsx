import {
  Circle,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import DisplayCard from "components/common/DisplayCard"
import useUser from "components/[guild]/hooks/useUser"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Image from "next/image"
import { CaretRight, IconProps } from "phosphor-react"
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
  onSelection: (platform: PlatformName) => void
} & Rest

const PlatformSelectButton = ({
  platform,
  hook,
  title,
  description,
  imageUrl,
  icon,
  onSelection,
  ...rest
}: Props) => {
  const { account } = useWeb3React()
  const { openWalletSelectorModal } = useWeb3ConnectionManager()
  const { onClick, isLoading, loadingText, rightIcon } =
    hook?.({ platform, onSelection }) ?? {}

  const selectPlatform = () => onSelection(platform)

  const user = useUser()
  const isPlatformConnected = user.platformUsers?.some(
    ({ platformName, platformUserData }) =>
      platformName === platform && !platformUserData?.readonly
  )

  const circleBgColor = useColorModeValue("gray.700", "gray.600")

  return (
    <DisplayCard
      cursor="pointer"
      onClick={!account ? openWalletSelectorModal : onClick ?? selectPlatform}
      h="auto"
      {...rest}
      data-test={`${platform}-select-button${
        isPlatformConnected ? "-connected" : ""
      }`}
    >
      <HStack spacing={4}>
        {icon ? (
          <Circle bgColor={circleBgColor} size="12" pos="relative" overflow="hidden">
            <Icon as={icon} boxSize={6} weight="regular" />
          </Circle>
        ) : (
          <Circle size="12" pos="relative" overflow="hidden">
            <Image src={imageUrl} alt="Guild logo" layout="fill" />
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
        <Icon as={isLoading ? Spinner : (account && rightIcon) ?? CaretRight} />
      </HStack>
    </DisplayCard>
  )
}

export default PlatformSelectButton
