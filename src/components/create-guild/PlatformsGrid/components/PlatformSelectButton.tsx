import {
  Circle,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import DisplayCard from "components/common/DisplayCard"
import useUser from "components/[guild]/hooks/useUser"
import useConnectPlatform from "components/[guild]/JoinModal/hooks/useConnectPlatform"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import dynamic from "next/dynamic"
import Image from "next/image"
import { ArrowSquareIn, CaretRight } from "phosphor-react"
import { useMemo } from "react"

const PlatformSelectButton = ({
  platform,
  title,
  description,
  imageUrl,
  onSelection,
  ...rest
}) => {
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
  const isPlatformConnected = user.platformUsers?.some(
    ({ platformName, platformUserData }) =>
      platformName === platform && !platformUserData?.readonly
  )

  const DynamicCtaIcon = useMemo(
    () => dynamic(async () => (!isPlatformConnected ? ArrowSquareIn : CaretRight)),
    [isPlatformConnected]
  )

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
        <Circle size="12" pos="relative" overflow="hidden">
          <Image src={imageUrl} alt="Guild logo" layout="fill" />
        </Circle>
        <VStack spacing={1} alignItems="start" w="full" maxW="full" mb="1" mt="-1">
          <Heading
            fontSize="lg"
            fontWeight="bold"
            letterSpacing="wide"
            maxW="full"
            noOfLines={1}
          >
            {title}
          </Heading>
          <Text letterSpacing="wide" colorScheme="gray">
            {(isLoading && `${loadingText}...`) || description}
          </Text>
        </VStack>
        <Icon as={isLoading ? Spinner : (account && DynamicCtaIcon) ?? CaretRight} />
      </HStack>
    </DisplayCard>
  )
}

export default PlatformSelectButton
