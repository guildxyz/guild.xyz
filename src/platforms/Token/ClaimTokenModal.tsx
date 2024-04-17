import {
  Flex,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react"
import { TokenAccessHubData } from "components/[guild]/AccessHub/hooks/useAccessedTokens"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useRole from "components/[guild]/hooks/useRole"
import Button from "components/common/Button"
import Card, { useCardBg } from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import useColorPalette from "hooks/useColorPalette"
import Image from "next/image"
import { useAccount } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import TokenClaimFeeTable from "./ClaimFeeTable"
import { useTokenRewardContext } from "./TokenRewardContext"
import { useCalculateClaimableTokens } from "./hooks/useCalculateToken"
import useClaimToken from "./hooks/useClaimToken"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const RoleTokenClaimCard = ({
  reward,
  calc,
}: {
  reward: TokenAccessHubData["rewardsByRoles"][number]
  calc: (roleRewards: TokenAccessHubData["rewardsByRoles"][0]["rewards"]) => number
}) => {
  const { chain, token } = useTokenRewardContext()

  const { onSubmit } = useClaimToken(
    chain,
    reward.roleId,
    reward.rewards[0].rolePlatform.id
  )

  const { id: guildId } = useGuild()

  const { imageUrl, name } = useRole(guildId, reward.roleId)

  const { colorMode } = useColorMode()

  const claimable = calc(reward.rewards)

  return (
    <Card
      px={4}
      py={4}
      bg={colorMode === "light" ? "blackAlpha.100" : "blackAlpha.300"}
      boxShadow={"none"}
    >
      <HStack gap={3}>
        <GuildLogo imageUrl={imageUrl} size={{ base: "24px", md: "36px" }} />

        <Stack gap={0}>
          <Text fontSize="sm" color="GrayText">
            {name}
          </Text>
          <Heading fontSize={"md"}>
            {" "}
            {claimable} {token.symbol}{" "}
          </Heading>
        </Stack>

        <Button colorScheme="gold" size="sm" ml={"auto"}>
          Claim
        </Button>
      </HStack>
    </Card>
  )
}

const ClaimTokenModal = ({ isOpen, onClose }: Props) => {
  const { textColor } = useThemeContext()
  const modalBg = useCardBg()

  const { chain, rewardsByRoles, token, isTokenLoading, rewardImageUrl } =
    useTokenRewardContext()

  const { getValue, calcForRole } = useCalculateClaimableTokens(rewardsByRoles)
  const claimableAmount = getValue()

  const { onSubmit } = useClaimToken(
    chain,
    rewardsByRoles[0].roleId,
    rewardsByRoles[0].rewards[0].rolePlatform.id
  )

  const { chainId } = useAccount()
  const isOnCorrectChain = Number(Chains[chain]) === chainId
  const gold = useColorPalette("gold", "gold")

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        border={"3px solid transparent"}
        background={`linear-gradient(${modalBg}, ${modalBg}) padding-box, linear-gradient(to bottom, ${gold["--gold-500"]}, ${modalBg}) border-box`}
      >
        <Image
          priority
          src={"/img/confetti_overlay.png"}
          alt="Confetti"
          quality={100}
          fill
          style={{ objectFit: "contain", objectPosition: "top" }}
          draggable={false}
        />

        <ModalCloseButton />
        <ModalHeader mb="0" pb={0}>
          <Text textAlign={"center"}>Claim your tokens</Text>
        </ModalHeader>

        <ModalBody
          className="custom-scrollbar"
          display="flex"
          flexDir="column"
          border={"4px solid transparent"}
          mt="0"
        >
          <Text textAlign={"center"} opacity={0.5}>
            You are eligible to claim the following tokens.
          </Text>

          <Stack
            justifyContent={"center"}
            position={"relative"}
            alignItems={"center"}
            my={8}
          >
            <Image
              priority
              src={"/img/cup.png"}
              alt="Cup"
              width={175}
              height={155}
              draggable={false}
            />

            <VStack position={"relative"} mt="-80px">
              <Image
                src={"/img/ribbon.svg"}
                alt="Ribbon"
                priority
                width={300}
                height={70}
                draggable={false}
              />

              <Skeleton isLoaded={!isTokenLoading}>
                <Flex
                  alignItems={"center"}
                  gap={2}
                  position={"absolute"}
                  top={"50%"}
                  left={0}
                  justifyContent={"center"}
                  style={{ transform: "translateY(-33%)" }}
                  width={"full"}
                >
                  <GuildLogo imageUrl={rewardImageUrl} size={"26px"} />
                  <Heading
                    fontSize={"x-large"}
                    fontFamily="display"
                    color={textColor}
                    marginTop={"-3px"}
                  >
                    {" "}
                    {claimableAmount} {token.symbol}
                  </Heading>
                </Flex>
              </Skeleton>
            </VStack>
          </Stack>

          <TokenClaimFeeTable />
          {!isOnCorrectChain ? (
            <SwitchNetworkButton targetChainId={Number(Chains[chain])} />
          ) : (
            <>
              {rewardsByRoles.length === 1 ? (
                <Button
                  colorScheme="gold"
                  mt={2}
                  isDisabled={isTokenLoading}
                  onClick={onSubmit}
                >
                  Claim
                </Button>
              ) : (
                <Stack gap={2} mt={2}>
                  {rewardsByRoles.map((reward) => (
                    <RoleTokenClaimCard
                      key={`${reward.roleId}`}
                      reward={reward}
                      calc={calcForRole}
                    />
                  ))}
                </Stack>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ClaimTokenModal
