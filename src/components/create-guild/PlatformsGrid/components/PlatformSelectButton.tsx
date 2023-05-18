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
import useUser from "components/[guild]/hooks/useUser"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import DisplayCard from "components/common/DisplayCard"
import Image from "next/image"
import { CaretRight } from "phosphor-react"

const PlatformSelectButton = ({
  platform,
  hook,
  title,
  description,
  imageUrl,
  onSelection,
  ...rest
}) => {
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
        <Icon as={isLoading ? Spinner : (account && rightIcon) ?? CaretRight} />
      </HStack>
    </DisplayCard>
  )
}

export default PlatformSelectButton
