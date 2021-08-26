import { Box, Icon, LayoutProps } from "@chakra-ui/react"
import { ImageSquare } from "phosphor-react"

type Props = {
  boxSize: LayoutProps["boxSize"]
}

const ImgPlaceholder = ({ boxSize }: Props): JSX.Element => (
  <Box
    width={boxSize}
    height={boxSize}
    minWidth={boxSize}
    minHeight={boxSize}
    display="flex"
    alignItems="center"
    justifyContent="center"
    bgColor="gray.200"
    rounded="full"
  >
    <Icon as={ImageSquare} color="gray.400" />
  </Box>
)

export default ImgPlaceholder
