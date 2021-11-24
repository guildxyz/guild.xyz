import { Button, useBreakpointValue, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import { forwardRef, PropsWithChildren } from "react"

const CtaButton = forwardRef(
  ({ children, ...rest }: PropsWithChildren<any>, ref): JSX.Element => {
    const { colorMode } = useColorMode()
    const isMobile = useBreakpointValue({ base: true, md: false })
    const { colorScheme, variant, ...mobileRest } = rest

    if (isMobile) {
      return (
        <Card
          // cancel margin added by layout parent components like Stack
          ml="0 !important"
          position="fixed"
          left={0}
          bottom={0}
          width="100vw"
          background={colorMode === "light" ? "white" : "gray.600"}
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
            {...mobileRest}
          >
            {children}
          </Button>
        </Card>
      )
    }

    return (
      <Card>
        <Button variant="ghost" ref={ref} {...rest}>
          {children}
        </Button>
      </Card>
    )
  }
)

export default CtaButton
