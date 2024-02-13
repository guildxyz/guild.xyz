import { Textarea, TextareaProps, forwardRef } from "@chakra-ui/react"

const LongText = forwardRef<TextareaProps, "textarea">((props, ref) => (
  <Textarea
    ref={ref}
    {...props}
    value={props.value ?? ""}
    placeholder="Long text"
    resize={props.isDisabled ? "none" : undefined}
  />
))

export default LongText
