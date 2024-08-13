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

type Props = {
  isDisabled?: boolean
  rolePlatform: RolePlatform
} & ButtonProps

const DynamicClaimTokenModal = dynamic(() => import("./ClaimTokenModal"))

const ClaimTokenButton = ({
  rolePlatform,
  isDisabled,
  children,
  ...rest
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isFromGeogatedCountry = useIsFromGeogatedCountry()

  const { isAvailable } = getRolePlatformTimeframeInfo(rolePlatform)

  return (
    <>
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
    </>
  )
}

export default ClaimTokenButton
