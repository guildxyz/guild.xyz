import { useBreakpointValue, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"

const AccountCard = ({ children }): JSX.Element => {
  const { colorMode } = useColorMode()
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (isMobile) {
    return (
      <Card
        position="fixed"
        left={0}
        bottom={0}
        width="100vw"
        background={colorMode === "light" ? "whiteAlpha.700" : "blackAlpha.400"}
        borderTop="1px"
        borderTopColor={colorMode === "light" ? "gray.100" : "gray.600"}
        borderRadius="none"
        zIndex="docked"
        style={{
          backdropFilter: "blur(10px)",
        }}
      >
        {children}
      </Card>
    )
  }
  return <Card>{children}</Card>
}

export default AccountCard
