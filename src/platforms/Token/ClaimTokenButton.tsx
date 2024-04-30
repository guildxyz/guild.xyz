import { ButtonProps, useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import dynamic from "next/dynamic"
import {
  GeogatedCountryPopover,
  useIsFromGeogatedCountry,
} from "./GeogatedCountryAlert"

type Props = {
  isDisabled?: boolean
} & ButtonProps

const DynamicClaimTokenModal = dynamic(() => import("./ClaimTokenModal"))

const ClaimTokenButton = ({ isDisabled, children, ...rest }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isFromGeogatedCountry = useIsFromGeogatedCountry()

  return (
    <>
      <GeogatedCountryPopover isDisabled={!isFromGeogatedCountry}>
        <Button
          colorScheme="gold"
          w="full"
          isDisabled={isDisabled || isFromGeogatedCountry}
          onClick={onOpen}
          {...rest}
        >
          {children ?? "Claim"}
        </Button>
      </GeogatedCountryPopover>
      {!isDisabled && <DynamicClaimTokenModal isOpen={isOpen} onClose={onClose} />}
    </>
  )
}

export default ClaimTokenButton
