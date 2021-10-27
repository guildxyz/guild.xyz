import { Button, ButtonProps, useColorMode } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const AccountButton = ({
  children,
  ...rest
}: PropsWithChildren<ButtonProps>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Button
      flexGrow={1}
      borderRadius="2xl"
      bg="blackAlpha.300"
      color="whiteAlpha.900"
      {...rest}
    >
      {children}
    </Button>
  )
}

export default AccountButton
