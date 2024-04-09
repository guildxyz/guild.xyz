import { Tooltip, useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import { claimTextButtonTooltipLabel } from "platforms/SecretText/TextCardButton"
import { GuildPlatform } from "types"
import { getRolePlatformStatus } from "utils/rolePlatformHelpers"
import ClaimTokenModal from "./ClaimTokenModal"
import { TokenRewardProvider, useTokenRewardContext } from "./TokenRewardContext"

const TokenCardButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { rolePlatform } = useTokenRewardContext()

  return (
    <>
      <Tooltip
        label={claimTextButtonTooltipLabel[getRolePlatformStatus(rolePlatform)]}
        hasArrow
        shouldWrapChildren
        w="full"
      >
        <Button colorScheme="primary" w="full" isDisabled={false} onClick={onOpen}>
          Claim
        </Button>
      </Tooltip>

      <ClaimTokenModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

const TokenButtonWrapper = ({ platform }: { platform: GuildPlatform }) => {
  return (
    <>
      <TokenRewardProvider guildPlatform={platform}>
        <TokenCardButton />
      </TokenRewardProvider>
    </>
  )
}

export { TokenButtonWrapper as TokenCardButton }
