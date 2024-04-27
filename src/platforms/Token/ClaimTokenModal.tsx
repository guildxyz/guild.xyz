import {
  Checkbox,
  Divider,
  Flex,
  Heading,
  Icon,
  Link,
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
} from "@chakra-ui/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import { useThemeContext } from "components/[guild]/ThemeContext"
import Button from "components/common/Button"
import { useCardBg } from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import useColorPalette from "hooks/useColorPalette"
import Image from "next/image"
import { ArrowSquareOut } from "phosphor-react"
import { useMemo, useState } from "react"
import { useAccount } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import TokenClaimFeeTable from "./ClaimFeeTable"
import { useTokenRewardContext } from "./TokenRewardContext"
import TokenRolePlatformClaimCard from "./TokenRolePlatformClaimCard"
import { useClaimableTokens } from "./hooks/useCalculateToken"
import useCollectToken from "./hooks/useCollectToken"
import usePool from "./hooks/usePool"
import useRolePlatforms from "./hooks/useRolePlatforms"
import useTokenClaimedAmount from "./hooks/useTokenClaimedAmount"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ClaimTokenModal = ({ isOpen, onClose }: Props) => {
  const { textColor } = useThemeContext()
  const modalBg = useCardBg()
  const [isConfirmed, setIsConfirmed] = useState(false)

  const { token, guildPlatform, imageUrl } = useTokenRewardContext()
  const claimableAmount = useClaimableTokens(guildPlatform)

  const { refetch } = usePool(
    guildPlatform.platformGuildData.chain,
    BigInt(guildPlatform.platformGuildData.poolId)
  )

  const chain = guildPlatform.platformGuildData.chain

  const rolePlatforms = useRolePlatforms(guildPlatform.id)

  const { onSubmit, loadingText: claimLoadingText } = useCollectToken(
    chain,
    rolePlatforms[0]?.roleId,
    rolePlatforms[0]?.id,
    () => {
      onClose()
      refetch()
      refetchClaimedAmount()
    }
  )

  const { refetch: refetchClaimedAmount } = useTokenClaimedAmount(
    guildPlatform.platformGuildData.chain,
    guildPlatform.platformGuildData.poolId,
    rolePlatforms.map((rp) => rp.id),
    token.data.decimals
  )

  const { chainId } = useAccount()
  const isOnCorrectChain = Number(Chains[chain]) === chainId
  const gold = useColorPalette("gold", "gold")

  const { triggerMembershipUpdate: submitClaim, isLoading: membershipLoading } =
    useMembershipUpdate({
      onSuccess: () => {
        onSubmit()
      },
      onError: (error) => {
        console.error(error)
      },
    })

  const claimLoading = useMemo(
    () =>
      membershipLoading
        ? "Checking access..."
        : claimLoadingText
        ? claimLoadingText
        : null,
    [membershipLoading, claimLoadingText]
  )

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
          <Text>{`Claim your ${token.data.symbol}`}</Text>
        </ModalHeader>

        <ModalBody
          className="custom-scrollbar"
          display="flex"
          flexDir="column"
          border={"4px solid transparent"}
          mt="0"
        >
          <Stack
            justifyContent={"center"}
            position={"relative"}
            alignItems={"center"}
            mt={8}
            mb={4}
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

              <Skeleton isLoaded={!token.isLoading}>
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
                  <GuildLogo imageUrl={imageUrl} size={"26px"} />
                  <Heading
                    fontSize={"x-large"}
                    fontFamily="display"
                    color={textColor}
                    marginTop={"-3px"}
                  >
                    {" "}
                    {claimableAmount} {token.data.symbol}
                  </Heading>
                </Flex>
              </Skeleton>
            </VStack>
          </Stack>

          <Divider
            mt="8"
            mb="4"
            borderColor="var(--chakra-colors-chakra-border-color)"
          />

          <TokenClaimFeeTable />

          <Checkbox
            size="sm"
            alignItems="start"
            mt="6"
            mb="5"
            isChecked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
          >
            <Text colorScheme="gray" mt="-5px">
              {`I confirm that I am not a citizen of the U.S., Canada, or any other `}
              <Link
                href="https://help.guild.xyz/en/articles/9246601-restricted-countries"
                isExternal
                fontWeight={"semibold"}
                onClick={(e) => e.stopPropagation()}
              >
                restricted countries
                <Icon as={ArrowSquareOut} ml="0.5" />
              </Link>
            </Text>
          </Checkbox>

          {!isOnCorrectChain ? (
            <SwitchNetworkButton targetChainId={Number(Chains[chain])} />
          ) : (
            <>
              {rolePlatforms.length === 1 ? (
                <Button
                  colorScheme="gold"
                  isDisabled={token.isLoading || !isConfirmed}
                  isLoading={claimLoading}
                  loadingText={claimLoading}
                  onClick={() => {
                    submitClaim({
                      roleIds: [rolePlatforms[0].roleId],
                      saveClaimData: true,
                    })
                  }}
                >
                  Claim
                </Button>
              ) : (
                <Stack gap={2}>
                  {rolePlatforms.map((rolePlatform) => (
                    <>
                      <TokenRolePlatformClaimCard
                        key={`${rolePlatform.roleId}`}
                        rolePlatform={rolePlatform}
                      />
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
