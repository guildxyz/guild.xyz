import { Box, Container, ContainerProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import Card from "./Card"

type Props = { maxWidth?: ContainerProps["maxWidth"] }

const FloatingFooter = ({
  maxWidth = "container.lg",
  children,
}: PropsWithChildren<Props>) => (
  <Box
    position="fixed"
    bottom={0}
    left={0}
    w="full"
    zIndex={1201} // above intercom floating button
  >
    <Container maxWidth={maxWidth} px={{ base: 0, md: 8, lg: 10 }}>
      {/**
       * Intercom: This box keeps the container padding, so the Card inside could be
       * `width:100%`
       */}
      <Box position="relative">
        <Card
          borderRadius={0}
          borderTopRadius={{ md: "2xl" }}
          borderWidth={{ base: "1px 0 0 0", md: "1px 1px 0 1px" }}
          shadow="rgba(0, 0, 0, 0.1) 0px 5px 10px,rgba(0, 0, 0, 0.2) 0px 15px 40px"
          position="absolute"
          bottom={0}
          w="full"
        >
          {children}
        </Card>
      </Box>
    </Container>
  </Box>
)

export default FloatingFooter
