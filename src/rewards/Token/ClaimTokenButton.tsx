import { ButtonProps, Tooltip, useDisclosure } from "@chakra-ui/react"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import dynamic from "next/dynamic"
import { claimTextButtonTooltipLabel } from "rewards/SecretText/TextCardButton"
import { RewardCardButton } from "rewards/components/RewardCardButton"
import { RolePlatform } from "types"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"
import {
  GeogatedCountryPopover,
  useIsFromGeogatedCountry,
} from "./GeogatedCountryAlert"
import { TokenRewardProvider } from "./TokenRewardContext"

type Props = {
  isDisabled?: boolean
  rolePlatform: RolePlatform
} & ButtonProps

const DynamicClaimTokenModal = dynamic(() => import("./ClaimTokenModal"))

const ClaimTokenButton = ({ isDisabled, children, ...rest }: Props) => {
  const rolePlatform = useRolePlatform()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const isFromGeogatedCountry = useIsFromGeogatedCountry()

  const { isAvailable } = getRolePlatformTimeframeInfo(rolePlatform)

  return (
    <TokenRewardProvider guildPlatform={rolePlatform.guildPlatform}>
      <GeogatedCountryPopover isDisabled={!isFromGeogatedCountry}>
        <Tooltip
          isDisabled={!isAvailable}
          label={claimTextButtonTooltipLabel[getRolePlatformStatus(rolePlatform)]}
          hasArrow
          shouldWrapChildren
        >
          <RewardCardButton
            colorScheme="gold"
            isDisabled={isDisabled || isFromGeogatedCountry || !isAvailable}
            onClick={onOpen}
            {...rest}
          >
            {children ?? "Claim"}
          </RewardCardButton>
        </Tooltip>
      </GeogatedCountryPopover>
      {!isDisabled && <DynamicClaimTokenModal isOpen={isOpen} onClose={onClose} />}
    </TokenRewardProvider>
  )
}

export default ClaimTokenButton
