import { ButtonProps, Tooltip, useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import dynamic from "next/dynamic"
import { claimTextButtonTooltipLabel } from "platforms/SecretText/TextCardButton"
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
          <Button
            colorScheme="gold"
            w="full"
            isDisabled={isDisabled || isFromGeogatedCountry || !isAvailable}
            onClick={onOpen}
            {...rest}
          >
            {children ?? "Claim"}
          </Button>
        </Tooltip>
      </GeogatedCountryPopover>
      {!isDisabled && <DynamicClaimTokenModal isOpen={isOpen} onClose={onClose} />}
    </>
  )
}

export default ClaimTokenButton
