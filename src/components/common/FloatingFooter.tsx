import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  forwardRef,
} from "@chakra-ui/react"
import useIsStuck from "hooks/useIsStuck"
import { PropsWithChildren } from "react"
import Card from "./Card"

type Props = { maxWidth?: ContainerProps["maxWidth"] }

/**
 * These two components are really similar and I wanted to just keep the new simpler
 * sticky one, but couldn't handle cases in create-guild so ended up just keeping the
 * floating one too, separately. When we rework the create-guild flow, we might be
 * able to delete it
 */

// for fixed, always floating footers, like now on create-guild page
const FloatingFooter = forwardRef<BoxProps, "div">(
  ({ maxWidth = "container.lg", children }, ref) => (
    <Box
      ref={ref}
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
)

// for sticky footers, similar to StickyBar, but on the bottom
const StickyFooter = ({ children, ...rest }: PropsWithChildren<any>) => {
  const { ref, isStuck } = useIsStuck()

  return (
    <Card
      ref={ref}
      position="sticky"
      bottom="-1px"
      mt="6"
      zIndex={1201} // above intercom floating button
      isFullWidthOnMobile={isStuck}
      {...(isStuck && {
        borderBottomRadius: "0 !important",
        borderWidth: { base: "1px 0 0 0", md: "1px 1px 0 1px" },
        boxShadow:
          "rgba(0, 0, 0, 0.1) 0px 5px 10px,rgba(0, 0, 0, 0.2) 0px 15px 40px",
      })}
      {...rest}
    >
      {children}
    </Card>
  )
}

export { FloatingFooter, StickyFooter }
