import {
  Checkbox,
  Collapse,
  Divider,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import SwitchNetworkButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/SwitchNetworkButton"
import useIsBalanceSufficient from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/hooks/useIsBalanceSufficient"
import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import Button from "components/common/Button"
import { useCardBg } from "components/common/Card"
import Image from "next/image"
import { ArrowSquareOut } from "phosphor-react"
import { claimTextButtonTooltipLabel } from "platforms/SecretText/TextCardButton"
import { useMemo, useState } from "react"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"
import { formatUnits } from "viem"
import { useAccount } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import TokenClaimFeeTable from "../TokenClaimFeeTable"
import { useTokenRewardContext } from "../TokenRewardContext"
import useCollectToken from "../hooks/useCollectToken"
import usePool from "../hooks/usePool"
import useRolePlatformsOfReward from "../hooks/useRolePlatformsOfReward"
import useTokenClaimedAmount from "../hooks/useTokenClaimedAmount"
import TokenRibbonIllustration from "./TokenRibbonIllustration"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ClaimTokenModal = ({ isOpen, onClose }: Props) => {
  const modalBg = useCardBg()
  const [isConfirmed, setIsConfirmed] = useState(false)

  const { fee, token, guildPlatform } = useTokenRewardContext()

  const { refetch } = usePool(
    guildPlatform.platformGuildData.chain,
    BigInt(guildPlatform.platformGuildData.poolId)
  )

  const chain = guildPlatform.platformGuildData.chain
  const rolePlatforms = useRolePlatformsOfReward(guildPlatform.id)

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

  const formattedFee =
    fee.isLoading || token.isLoading || !fee?.amount || !token?.data?.decimals
      ? null
      : formatUnits(fee.amount, token.data.decimals)

  const { isBalanceSufficient } = useIsBalanceSufficient({
    address: NULL_ADDRESS,
    chain: chain,
    amount: formattedFee,
  })

  const { isAvailable } = getRolePlatformTimeframeInfo(rolePlatforms[0])

  const disabledTooltipLabel = useMemo(() => {
    if (!isAvailable)
      return claimTextButtonTooltipLabel[getRolePlatformStatus(rolePlatforms[0])]
    if (!isBalanceSufficient)
      return "You don't have enough balance to pay the guild fee!"
  }, [isAvailable, isBalanceSufficient, rolePlatforms])

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        border={"3px solid transparent"}
        background={`linear-gradient(${modalBg}, ${modalBg}) padding-box, linear-gradient(to bottom, var(--chakra-colors-gold-500), ${modalBg}) border-box`}
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
          <TokenRibbonIllustration />

          <VStack>
            <AvailabilityTags rolePlatform={rolePlatforms[0]} />
          </VStack>

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

          <Stack>
            {/* Collapse components always have to be wrapped
            by a component that allows overflow, because of some
            weird issue:
            https://github.com/chakra-ui/chakra-ui/issues/2966
            */}

            <SwitchNetworkButton targetChainId={Number(Chains[chain])} />
            <Collapse
              in={isOnCorrectChain}
              style={{ overflow: "initial !important" }}
            >
              <Tooltip label={disabledTooltipLabel} hasArrow>
                <Button
                  colorScheme="gold"
                  isDisabled={
                    token.isLoading ||
                    !isConfirmed ||
                    !isBalanceSufficient ||
                    !isAvailable
                  }
                  isLoading={claimLoading}
                  loadingText={claimLoading}
                  flexShrink={0}
                  w="full"
                  onClick={() => {
                    submitClaim({
                      roleIds: [rolePlatforms[0].roleId],
                      saveClaimData: true,
                    })
                  }}
                >
                  {isBalanceSufficient ? "Claim" : "Insufficient balance"}
                </Button>
              </Tooltip>
            </Collapse>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ClaimTokenModal
