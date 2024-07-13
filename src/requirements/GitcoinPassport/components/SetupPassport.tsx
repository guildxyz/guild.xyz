import { Link } from "@chakra-ui/next-js"
import { ButtonProps } from "@chakra-ui/react"
import { ArrowSquareOut } from "@phosphor-icons/react/ArrowSquareOut"
import Button from "components/common/Button"

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
      rightIcon={<ArrowSquareOut />}
      iconSpacing="1"
      {...buttonProps}
    >
      Setup Passport
    </Button>
  </Link>
)

export default SetupPassport
