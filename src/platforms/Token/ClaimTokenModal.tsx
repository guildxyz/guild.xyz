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
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useRole from "components/[guild]/hooks/useRole"
import Button from "components/common/Button"
import Card, { useCardBg } from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import useColorPalette from "hooks/useColorPalette"
import Image from "next/image"
import { useMemo } from "react"
import { RolePlatform } from "types"
import { useAccount } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import TokenClaimFeeTable from "./ClaimFeeTable"
import { useTokenRewardContext } from "./TokenRewardContext"
import {
  useCalculateClaimableTokens,
  useCalculateFromDynamic,
} from "./hooks/useCalculateToken"
import useCollectToken from "./hooks/useCollectToken"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const RolePlatformClaimCard = ({ rolePlatform }: { rolePlatform: RolePlatform }) => {
  const { tokenReward, token } = useTokenRewardContext()
  const { getValue } = useCalculateFromDynamic(rolePlatform.dynamicAmount)

  const {
    onSubmit: onTokenClaimSubmit,
    isLoading: isClaiming,
    loadingText: claimLoadingText,
  } = useCollectToken(
    tokenReward.guildPlatform.platformGuildData.chain,
    rolePlatform.roleId,
    rolePlatform.id
  )

  const { id: guildId } = useGuild()

  const { imageUrl, name } = useRole(guildId, rolePlatform.roleId)

  const { colorMode } = useColorMode()

  const claimable = getValue()

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

  const { tokenReward, token, isTokenLoading, rewardImageUrl } =
    useTokenRewardContext()

  const { getValue } = useCalculateClaimableTokens(tokenReward.rolePlatformsByRoles)
  const claimableAmount = getValue()

  const chain = tokenReward.guildPlatform.platformGuildData.chain

  const {
    onSubmit,
    isLoading: isClaiming,
    loadingText: claimLoadingText,
  } = useCollectToken(
    chain,
    tokenReward.rolePlatformsByRoles[0]?.roleId,
    tokenReward.rolePlatformsByRoles[0]?.rolePlatforms[0].id
  )

  const { chainId } = useAccount()
  const isOnCorrectChain = Number(Chains[chain]) === chainId
  const gold = useColorPalette("gold", "gold")

  const { triggerMembershipUpdate: submitClaim, isLoading: membershipLoading } =
    useMembershipUpdate({
      onSuccess: (reponse) => {
        onSubmit()
      },
      onError: (error) => {
        console.error(error)
      },
    })

  const claimLoading = useMemo(() => {
    return membershipLoading
      ? "Checking access..."
      : claimLoadingText
      ? claimLoadingText
      : null
  }, [membershipLoading, claimLoadingText])

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
              {tokenReward.rolePlatformsByRoles.length === 1 ? (
                <Button
                  colorScheme="gold"
                  isDisabled={isTokenLoading}
                  isLoading={claimLoading}
                  loadingText={claimLoading}
                  onClick={() => {
                    submitClaim({
                      roleIds: [tokenReward.rolePlatformsByRoles[0].roleId],
                      saveClaimData: true,
                    })
                  }}
                >
                  Claim
                </Button>
              ) : (
                <Stack gap={2}>
                  {tokenReward.rolePlatformsByRoles.map((rolePlatformsByRole) => (
                    <>
                      {rolePlatformsByRole.rolePlatforms.map((rolePlatform) => (
                        <>
                          <RolePlatformClaimCard
                            key={`${rolePlatform.roleId}`}
                            rolePlatform={rolePlatform}
                          />
                        </>
                      ))}
                    </>
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
