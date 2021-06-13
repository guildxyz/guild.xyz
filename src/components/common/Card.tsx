/* eslint-disable react/jsx-props-no-spreading */
import { Box } from "@chakra-ui/react"

type Props = {
  children: JSX.Element | JSX.Element[]
  // for restProps
  [x: string]: any
}

const Card = ({ children, ...restProps }: Props): JSX.Element => (
  <Box
    shadow="md"
    borderRadius="xl"
    bg="white"
    display="flex"
    flexDirection="column"
    {...restProps}
  >
    {children}
  </Box>
)

export default Card
