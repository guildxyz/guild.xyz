/* eslint-disable react/jsx-props-no-spreading */
import { useColorMode, Box } from "@chakra-ui/react"

type Props = {
  isFullWidthOnMobile?: boolean
  children: JSX.Element | JSX.Element[]
  // for rest props
  [x: string]: any
}

const Card = ({
  isFullWidthOnMobile = false,
  children,
  ...rest
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Box
      mx={isFullWidthOnMobile && { base: -4, sm: 0 }}
      shadow="md"
      borderRadius={{ base: isFullWidthOnMobile ? "none" : "2xl", sm: "2xl" }}
      bg={colorMode === "light" ? "white" : "gray.700"}
      display="flex"
      flexDirection="column"
      {...rest}
    >
      {children}
    </Box>
  )
}

export default Card
