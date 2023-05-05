import { Box, ButtonProps, Button as ChakraButton, Text } from "@chakra-ui/react"
import { LegacyRef, PropsWithChildren, forwardRef } from "react"
import { Rest } from "types"

const Button = forwardRef(
  (
    { children, ...props }: PropsWithChildren<ButtonProps & Rest>,
    ref: LegacyRef<HTMLButtonElement>
  ): JSX.Element => {
    const { isLoading, loadingText } = props

    if (typeof children === "string")
      return (
        <ChakraButton
          key={
            isLoading && loadingText ? loadingText.toString() : children.toString()
          }
          ref={ref}
          {...props}
        >
          <Text
            as="span"
            noOfLines={1}
            sx={{
              display: "inline",
            }}
          >
            {isLoading && loadingText ? loadingText : children}
          </Text>
        </ChakraButton>
      )

    return (
      <ChakraButton ref={ref} {...props}>
        {isLoading && loadingText ? (
          <Text
            as="span"
            key={loadingText.toString()}
            noOfLines={1}
            sx={{
              display: "inline",
            }}
          >
            {loadingText}
          </Text>
        ) : (
          <Box>{children}</Box>
        )}
      </ChakraButton>
    )
  }
)

export default Button
