import { useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import { PropsWithChildren } from "react"

const AccountCard = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Card
      // bg={colorMode === "light" ? "blackAlpha.400" : "blackAlpha.300"}
      // boxShadow="none"
      // overflow="visible"
      borderColor="yellow"
      borderWidth="20"
    >
      {children}
    </Card>
  )
}

export default AccountCard
