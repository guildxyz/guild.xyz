import { Button, ButtonProps, useColorMode } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  white?: boolean
}

const AccountButton = ({
  white,
  children,
  ...rest
}: PropsWithChildren<Props & ButtonProps>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Button
      flexGrow={1}
      borderRadius="2xl"
      bg={
        colorMode === "light"
          ? (white && "white") || "gray.100"
          : (white && "whiteAlpha.200") || "blackAlpha.300"
      }
      {...rest}
    >
      {children}
    </Button>
  )
}

export default AccountButton
