import { Button, useColorMode } from "@chakra-ui/react"

const AccountButton = ({ children, ...rest }): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Button
      flexGrow={1}
      borderRadius="2xl"
      bg={colorMode === "light" ? "gray.100" : "blackAlpha.300"}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default AccountButton
