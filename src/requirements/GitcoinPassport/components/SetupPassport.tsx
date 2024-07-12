import { Link } from "@chakra-ui/next-js"
import { ButtonProps } from "@chakra-ui/react"
import Button from "components/common/Button"
import { ArrowSquareOut } from "phosphor-react"

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
