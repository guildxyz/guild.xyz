import { ButtonProps, Tooltip, useDisclosure } from "@chakra-ui/react"
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
import { TokenRewardProvider, useTokenRewardContext } from "./TokenRewardContext"

type Props = {
  isDisabled?: boolean
  rolePlatform: RolePlatform // TODO: decide if it should be a prop or we should get it from context!
} & ButtonProps

const DynamicClaimTokenModal = dynamic(() => import("./ClaimTokenModal"))

const ClaimTokenButton = ({
  isDisabled,
  rolePlatform,
  children,
  ...rest
}: Props) => {
  const { guildPlatform } = useTokenRewardContext()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const isFromGeogatedCountry = useIsFromGeogatedCountry()

  const { isAvailable } = getRolePlatformTimeframeInfo(rolePlatform)

  return (
    <TokenRewardProvider guildPlatform={guildPlatform}>
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
