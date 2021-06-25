/* eslint-disable react/jsx-props-no-spreading */
import { Box } from "@chakra-ui/react"

type Props = {
  children: JSX.Element | JSX.Element[]
  // for rest props
  [x: string]: any
}

const Card = ({ children, ...rest }: Props): JSX.Element => (
  <Box
    shadow="md"
    borderRadius="2xl"
    bg="white"
    display="flex"
    flexDirection="column"
    {...rest}
  >
    {children}
  </Box>
)

export default Card
