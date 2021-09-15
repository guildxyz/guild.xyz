import { Button, useBreakpointValue, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import { PropsWithChildren } from "react"

const CtaButton = ({ children, ...rest }: PropsWithChildren<any>): JSX.Element => {
  const { colorMode } = useColorMode()
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (isMobile) {
    return (
      <Card
        ml="auto"
        position="fixed"
        left={0}
        bottom={0}
        width="100vw"
        background={colorMode === "light" ? "gray.700" : "gray.600"}
        borderTop="1px"
        borderTopColor={colorMode === "light" ? "gray.100" : "gray.500"}
        borderRadius="none"
        zIndex="docked"
        style={{
          backdropFilter: "blur(10px)",
        }}
      >
        <Button variant="ghost" flexGrow={1} h={14} borderRadius="0" {...rest}>
          {children}
        </Button>
      </Card>
    )
  }
  return (
    <Button rounded="2xl" colorScheme="green" {...rest}>
      {children}
    </Button>
  )
}

export default CtaButton
