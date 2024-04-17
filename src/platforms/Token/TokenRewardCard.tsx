import {
  Circle,
  Divider,
  HStack,
  Heading,
  Img,
  MenuItem,
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
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import RemovePlatformMenuItem from "components/[guild]/AccessHub/components/RemovePlatformMenuItem"
import { TokenAccessHubData } from "components/[guild]/AccessHub/hooks/useAccessedTokens"
import useRemoveGuildPlatform from "components/[guild]/AccessHub/hooks/useRemoveGuildPlatform"
import PlatformCardMenu from "components/[guild]/RolePlatforms/components/PlatformCard/components/PlatformCardMenu"
import useGuild from "components/[guild]/hooks/useGuild"
import useRole from "components/[guild]/hooks/useRole"
import Button from "components/common/Button"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import RewardCard from "components/common/RewardCard"
import ConfirmationAlert from "components/create-guild/Requirements/components/ConfirmationAlert"
import { TrashSimple } from "phosphor-react"
import rewards from "platforms/rewards"
import { useEffect } from "react"
import TokenCardButton from "./TokenCardButton"
import { TokenRewardProvider, useTokenRewardContext } from "./TokenRewardContext"
import { useCalculateClaimableTokens } from "./hooks/useCalculateToken"

const DeleteTokenRewardCard = ({
  reward,
}: {
  reward: TokenAccessHubData["rewardsByRoles"][0]["rewards"][0]
}) => {
  const { onSubmit, isLoading, response } = useRemoveGuildPlatform(
    reward.guildPlatform.id
  )
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (!response) return
    onClose()
  }, [response])

  return (
    <Card
      px={4}
      py={4}
      bg={colorMode === "light" ? "blackAlpha.100" : "blackAlpha.300"}
      boxShadow={"none"}
      w="full"
    >
      <HStack gap={3}>
        <GuildLogo
          imageUrl={reward.guildPlatform.platformGuildData.imageUrl}
          size={"22px"}
        />

        <Stack gap={0}>
          <Text fontSize="sm" color="GrayText">
            {reward.guildPlatform.platformGuildData.name}
          </Text>
        </Stack>

        <Button
          colorScheme="red"
          size="sm"
          ml={"auto"}
          onClick={onOpen}
          isLoading={isLoading}
        >
          Delete
        </Button>
      </HStack>

      <ConfirmationAlert
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onSubmit}
        title="Remove reward"
        description={<>Are you sure you want to remove this reward?</>}
        confirmationText="Remove"
      />
    </Card>
  )
}

const DeleteTokenRewardsForRole = ({
  roleRewards,
}: {
  roleRewards: TokenAccessHubData["rewardsByRoles"][0]
}) => {
  const { id: guildId } = useGuild()
  const { imageUrl, name } = useRole(guildId, roleRewards.roleId)

  return (
    <Stack>
      <HStack gap={3} mb={2}>
        <GuildLogo imageUrl={imageUrl} size={"24px"} />
        <Heading fontSize={"md"}>{name}:</Heading>
      </HStack>

      <VStack gap={1} w="full">
        {roleRewards.rewards.map((reward, idx) => (
          <>
            <DeleteTokenRewardCard key={idx} reward={reward} />
          </>
        ))}
      </VStack>
    </Stack>
  )
}

const TokenRewardCard = () => {
  const { token, isTokenLoading, rewardImageUrl, rewardsByRoles } =
    useTokenRewardContext()

  const { getValue } = useCalculateClaimableTokens(rewardsByRoles)
  const claimableAmount = getValue()

  const color = useColorModeValue("red.600", "red.300")
  const bgColor = useColorModeValue("gray.700", "gray.600")

  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <RewardCard
        label={rewards.ERC20.name}
        title={isTokenLoading ? null : `Claim ${claimableAmount} ${token.symbol}`}
        colorScheme={"gold"}
        image={
          rewardImageUrl.match("guildLogos") ? (
            <Circle size={10} bgColor={bgColor}>
              <Img src={rewardImageUrl} alt="Guild logo" boxSize="40%" />
            </Circle>
          ) : (
            rewardImageUrl
          )
        }
        cornerButton={
          <>
            <PlatformCardMenu>
              {rewardsByRoles.length === 1 &&
              rewardsByRoles[0].rewards.length == 1 ? (
                <RemovePlatformMenuItem
                  platformGuildId={
                    rewardsByRoles[0].rewards[0].guildPlatform.platformGuildId
                  }
                />
              ) : (
                <MenuItem icon={<TrashSimple />} onClick={onOpen} color={color}>
                  Remove reward...
                </MenuItem>
              )}
            </PlatformCardMenu>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Remove token rewards</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Stack gap={4} divider={<Divider />}>
                    {rewardsByRoles.map((roleRewards, idx) => (
                      <>
                        <DeleteTokenRewardsForRole
                          key={idx}
                          roleRewards={roleRewards}
                        />
                      </>
                    ))}
                  </Stack>
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        }
      >
        <TokenCardButton />
      </RewardCard>
    </>
  )
}

const TokenRewardCardWrapper = ({ reward }: { reward: TokenAccessHubData }) => (
  <TokenRewardProvider tokenReward={reward}>
    <TokenRewardCard />
  </TokenRewardProvider>
)

export { TokenRewardCardWrapper as TokenRewardCard }
