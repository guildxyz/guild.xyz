import { Box, useColorModeValue } from "@chakra-ui/react"
import Card from "components/common/Card"
import useIsStuck from "hooks/useIsStuck"
import { PropsWithChildren } from "react"

const StickyBar = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const { ref, isStuck } = useIsStuck()
  const boxShadow = useColorModeValue("lg", "dark-lg")

  return (
    <Box ref={ref} position="sticky" top={0} zIndex={9}>
      <Card
        p="6"
        isFullWidthOnMobile
        {...(isStuck && {
          boxShadow,
          borderTopLeftRadius: "0px !important",
          borderTopRightRadius: "0px !important",
        })}
        transition="box-shadow .2s, borderRadius .2s"
      >
        {children}
      </Card>
    </Box>
  )
}

export default StickyBar
