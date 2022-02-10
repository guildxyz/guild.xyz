import { Box, Button as ChakraButton, ButtonProps, Text } from "@chakra-ui/react"
import { forwardRef, LegacyRef, PropsWithChildren } from "react"
import { Rest } from "types"

const Button = forwardRef(
  (
    { children, ...props }: PropsWithChildren<ButtonProps & Rest>,
    ref: LegacyRef<HTMLButtonElement>
  ): JSX.Element => {
    if (props.isLoading && props.loadingText) {
      const { loadingText, ...restProps } = props
      return (
        <ChakraButton ref={ref} {...restProps}>
          <Text as="span">{loadingText}</Text>
        </ChakraButton>
      )
    }

    if (typeof children === "string")
      return (
        <ChakraButton ref={ref} {...props}>
          <Text as="span">{children}</Text>
        </ChakraButton>
      )

    return (
      <ChakraButton ref={ref} {...props}>
        <Box>{children}</Box>
      </ChakraButton>
    )
  }
)

export default Button
