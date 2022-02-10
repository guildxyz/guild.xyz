import { Button as ChakraButton, ButtonProps, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const Button = ({
  children,
  ...props
}: PropsWithChildren<ButtonProps>): JSX.Element => {
  if (typeof children === "string")
    return (
      <ChakraButton {...props}>
        <Text as="span">{children}</Text>
      </ChakraButton>
    )

  return <ChakraButton {...props}>{children}</ChakraButton>
}

export default Button
