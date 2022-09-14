import { Box, Switch as ChakraSwitch, Text } from "@chakra-ui/react"
import { ForwardedRef, forwardRef } from "react"
import { Rest } from "types"

type Props = {
  title: string | JSX.Element
  description?: string
  isDisabled?: boolean
} & Rest

const Switch = forwardRef(
  (
    { title, description, isDisabled, ...rest }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ): JSX.Element => (
    <ChakraSwitch
      colorScheme="primary"
      display="inline-flex"
      whiteSpace={"normal"}
      lineHeight="normal"
      ref={ref}
      isDisabled={isDisabled}
      {...rest}
    >
      <Box opacity={isDisabled && 0.5}>
        <Text mb="1">{title}</Text>
        {description && (
          <Text fontWeight="normal" colorScheme="gray">
            {description}
          </Text>
        )}
      </Box>
    </ChakraSwitch>
  )
)

export default Switch
