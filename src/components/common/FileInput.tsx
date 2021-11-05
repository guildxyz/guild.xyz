import { InputGroup } from "@chakra-ui/react"
import { PropsWithChildren, useRef } from "react"
import { UseFormRegisterReturn } from "react-hook-form"

type Props = {
  register: UseFormRegisterReturn
  accept?: string
  onChange?: (e) => void
}

const FileInput = ({
  register,
  accept,
  onChange: customOnChange,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref, onChange, ...rest } = register

  const handleClick = () => inputRef.current?.click()

  return (
    <InputGroup onClick={handleClick} w="auto">
      <input
        type="file"
        hidden
        accept={accept}
        {...rest}
        ref={(e) => {
          ref(e)
          inputRef.current = e
        }}
        onChange={(e) => {
          onChange(e)
          customOnChange?.(e)
        }}
      />
      {children}
    </InputGroup>
  )
}

export default FileInput
