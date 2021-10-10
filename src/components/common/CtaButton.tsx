import { Button, useBreakpointValue, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import { forwardRef, PropsWithChildren } from "react"
import ColorButton from "./ColorButton"

const CtaButton = forwardRef(
  ({ children, ...rest }: PropsWithChildren<any>, ref): JSX.Element => {
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
          background={colorMode === "light" ? "white" : "gray.600"}
          borderTop="1px"
          borderTopColor={colorMode === "light" ? "gray.200" : "gray.500"}
          borderRadius="none"
          zIndex="docked"
          style={{
            backdropFilter: "blur(10px)",
          }}
        >
          <Button
            variant="ghost"
            flexGrow={1}
            h={14}
            borderRadius="0"
            ref={ref}
            {...rest}
          >
            {children}
          </Button>
        </Card>
      )
    }
    return (
      <ColorButton color="primary.500" rounded="2xl" ref={ref} {...rest}>
        {children}
      </ColorButton>
    )
  }
)

export default CtaButton
