import { ButtonProps, useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import ClaimTokenModal from "./ClaimTokenModal"
import {
  GeogatedCountryPopover,
  useIsFromGeogatedCountry,
} from "./GeogatedCountryAlert"

type Props = {
  isDisabled?: boolean
} & ButtonProps

const TokenCardButton = ({ isDisabled, children, ...rest }: Props) => {
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
      <ClaimTokenModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default TokenCardButton
