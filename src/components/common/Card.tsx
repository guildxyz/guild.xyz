import { Box, useColorMode, useColorModeValue } from "@chakra-ui/react"
import { PropsWithChildren, forwardRef } from "react"
import { Rest } from "types"

type Props = {
  isFullWidthOnMobile?: boolean
} & Rest

const Card = forwardRef(
  (
    { isFullWidthOnMobile = false, children, ...rest }: PropsWithChildren<Props>,
    ref: any
  ): JSX.Element => {
    const { colorMode } = useColorMode()

    return (
      <Box
        ref={ref}
        mx={
          // using !important so styles added by wrappers like Stack don't override it
          isFullWidthOnMobile && {
            base: "-4 !important",
            sm: "0 !important",
          }
        }
        bg={colorMode === "light" ? "white" : "gray.700"}
        shadow="md"
        borderRadius={{ base: isFullWidthOnMobile ? "none" : "2xl", sm: "2xl" }}
        display="flex"
        flexDirection="column"
        overflow="hidden"
        {...rest}
      >
        {children}
      </Box>
    )
  }
)

export const useCardBg = () =>
  useColorModeValue("white", "var(--chakra-colors-gray-700)")

export default Card
