import {
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
} from "@chakra-ui/react"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import { useThemeContext } from "components/[guild]/ThemeContext"
import Button from "components/common/Button"
import { useCardBg } from "components/common/Card"
import useColorPalette from "hooks/useColorPalette"
import Image from "next/image"
import { useAccount } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import TokenClaimFeeTable from "./ClaimFeeTable"
import { calculateClaimableAmount } from "./TokenRewardCard"
import { useTokenRewardContext } from "./TokenRewardContext"
import useClaimToken from "./hooks/useClaimToken"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ClaimTokenModal = ({ isOpen, onClose }: Props) => {
  const { textColor } = useThemeContext()
  const modalBg = useCardBg()

  const { chain, rewardsByRoles, token, isTokenLoading } = useTokenRewardContext()
  const claimableAmount = calculateClaimableAmount(rewardsByRoles)

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
              <Heading
                fontSize={"x-large"}
                fontFamily="display"
                color={textColor}
                position={"absolute"}
                top={"50%"}
                style={{ transform: "translateY(-25%)" }}
              >
                <Skeleton isLoaded={!isTokenLoading}>
                  {claimableAmount} {token.symbol}
                </Skeleton>
              </Heading>
            </VStack>
          </Stack>

          <TokenClaimFeeTable />
          {!isOnCorrectChain ? (
            <SwitchNetworkButton targetChainId={Number(Chains[chain])} />
          ) : (
            <Button
              colorScheme="gold"
              mt={2}
              isDisabled={isTokenLoading}
              onClick={onSubmit}
            >
              Claim
            </Button>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ClaimTokenModal
