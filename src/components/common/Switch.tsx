import { Switch as ChakraSwitch, Text } from "@chakra-ui/react"
import { ForwardedRef, forwardRef } from "react"
import { Rest } from "types"

type Props = {
  title: string
  description?: string
} & Rest

const Switch = forwardRef(
  (
    { title, description, ...rest }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ): JSX.Element => (
    <ChakraSwitch
      colorScheme="primary"
      display="inline-flex"
      whiteSpace={"normal"}
      lineHeight="normal"
      ref={ref}
      {...rest}
    >
      <Text mb="1">{title}</Text>
      {description && (
        <Text fontWeight="normal" colorScheme="gray">
          {description}
        </Text>
      )}
    </ChakraSwitch>
  )
)

export default Switch
