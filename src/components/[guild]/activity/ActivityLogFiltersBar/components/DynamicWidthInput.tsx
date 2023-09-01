import { Input, InputProps } from "@chakra-ui/react"
import { forwardRef } from "react"

const DynamicWidthInput = forwardRef(
  (props: InputProps, ref: any): JSX.Element => (
    <Input
      ref={ref}
      boxSizing="content-box"
      {...props}
      width={`${props.value?.toString().length ?? 0}ch`}
      minW={1}
      fontFamily="monospace"
    />
  )
)

export default DynamicWidthInput
