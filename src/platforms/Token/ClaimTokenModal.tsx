import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import { useThemeContext } from "components/[guild]/ThemeContext"
import Button from "components/common/Button"
import Image from "next/image"
import { useAccount } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import TokenClaimFeeTable from "./ClaimFeeTable"
import { useTokenRewardContext } from "./TokenRewardContext"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ClaimTokenModal = ({ isOpen, onClose }: Props) => {
  const { textColor } = useThemeContext()
  const { colorMode } = useColorMode()
  const modalBg = colorMode === "dark" ? "var(--chakra-colors-gray-700)" : "#FFFFFF"

  const { chain } = useTokenRewardContext()
  const { chainId } = useAccount()
  const isOnCorrectChain = Number(Chains[chain]) === chainId

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        border={"3px solid transparent"}
        background={`linear-gradient(${modalBg}, ${modalBg}) padding-box, linear-gradient(to bottom, #F5E4A0, ${modalBg}) border-box`}
      >
        <Image
          priority
          src={"/img/confetti_overlay.png"}
          alt="Confetti"
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
                5 UNI
              </Heading>
            </VStack>
          </Stack>

          <TokenClaimFeeTable />
          {!isOnCorrectChain ? (
            <SwitchNetworkButton targetChainId={Number(Chains[chain])} />
          ) : (
            <Button colorScheme="primary" mt={2}>
              Claim
            </Button>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ClaimTokenModal
