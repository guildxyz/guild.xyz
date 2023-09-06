import { Box, forwardRef, useColorModeValue } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

const Dropdown = forwardRef<PropsWithChildren<Rest>, "div">(
  ({ children, ...props }, ref): JSX.Element => {
    const bgColor = useColorModeValue("white", "gray.700")
    const shadow = useColorModeValue("lg", "dark-lg")

    return (
      <Box
        ref={ref}
        bgColor={bgColor}
        shadow={shadow}
        borderWidth={1}
        borderRadius="md"
        zIndex="modal"
        overflowY="auto"
        maxH="50vh"
        className="custom-scrollbar"
        {...props}
      >
        {children}
      </Box>
    )
  }
)

export default Dropdown
