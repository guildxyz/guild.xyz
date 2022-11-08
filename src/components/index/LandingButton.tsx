import { ButtonProps } from "@chakra-ui/react"
import Button from "components/common/Button"
import { forwardRef, PropsWithChildren, Ref } from "react"
import { Rest } from "types"

const LandingButton = forwardRef(
  (
    { children, ...rest }: PropsWithChildren<ButtonProps & Rest>,
    ref: Ref<HTMLButtonElement>
  ) => (
    <Button
      ref={ref}
      size={{ base: "md", md: "lg", xl: "xl" }}
      fontWeight="bold"
      {...rest}
    >
      {children}
    </Button>
  )
)

export default LandingButton
