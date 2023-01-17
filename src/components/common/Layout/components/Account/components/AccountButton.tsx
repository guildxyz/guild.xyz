import { ButtonProps } from "@chakra-ui/react"
import Button from "components/common/Button"
import { PropsWithChildren } from "react"

const AccountButton = ({
  children,
  ...rest
}: PropsWithChildren<ButtonProps>): JSX.Element => (
  <Button
    flexGrow={1}
    borderRadius="2xl"
    colorScheme="alpha"
    color="whiteAlpha.900"
    bg="blackAlpha.500"
    {...rest}
  >
    {children}
  </Button>
)

export default AccountButton
