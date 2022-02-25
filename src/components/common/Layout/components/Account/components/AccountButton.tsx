import { Button, ButtonProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const AccountButton = ({
  children,
  width,
  height,
  fontSize,
  ...rest
}: PropsWithChildren<ButtonProps>): JSX.Element => (
  <Button
    borderColor="yellow"
    borderWidth={4}
    borderRadius="none"
    flexGrow={1}
    backgroundColor="black"
    height={height}
    width={width}
    color="yellow"
    fontFamily="VT323"
    fontSize={fontSize}
    {...rest}
  >
    {children}
  </Button>
)

export default AccountButton
