import { ButtonProps } from "@chakra-ui/react"
import Button from "components/common/Button"
import { forwardRef, PropsWithChildren } from "react"

const AccountButton = forwardRef(
  ({ children, ...rest }: PropsWithChildren<ButtonProps>, ref: any): JSX.Element => (
    <Button
      ref={ref}
      flexGrow={1}
      borderRadius="2xl"
      colorScheme="alpha"
      color="whiteAlpha.900"
      bg="blackAlpha.500"
      {...rest}
    >
      {children}
    </Button>
  )
)

export default AccountButton
