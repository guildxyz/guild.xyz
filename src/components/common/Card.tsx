import { Box, useColorMode } from "@chakra-ui/react"

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

export default Card
