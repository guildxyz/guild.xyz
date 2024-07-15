import { Link } from "@chakra-ui/next-js"
import { ButtonProps } from "@chakra-ui/react"
import Button from "components/common/Button"
import { PiArrowSquareOut } from "react-icons/pi"

const SetupPassport = (buttonProps: ButtonProps) => (
  <Link
    href="https://passport.gitcoin.co"
    isExternal
    _hover={{
      textDecoration: "none",
    }}
  >
    <Button
      size="xs"
      colorScheme="teal"
      rightIcon={<PiArrowSquareOut />}
      iconSpacing="1"
      {...buttonProps}
    >
      Setup Passport
    </Button>
  </Link>
)

export default SetupPassport
