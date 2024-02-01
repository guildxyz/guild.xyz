import { Input, InputProps, forwardRef } from "@chakra-ui/react"

const ShortText = forwardRef<InputProps, "input">((props, ref) => (
  <Input ref={ref} {...props} value={props.value ?? ""} placeholder="Short text" />
))

export default ShortText
