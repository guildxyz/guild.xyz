import { IconButton, theme, useColorModeValue } from "@chakra-ui/react"
import { transparentize } from "@chakra-ui/theme-tools"
import { Check } from "@phosphor-icons/react/Check"
import { Copy } from "@phosphor-icons/react/Copy"
import { GroupBase, IndicatorsContainerProps, components } from "chakra-react-select"
import { useState } from "react"
import parseFromObject from "utils/parseFromObject"
import { StyledSelectProps } from "../StyledSelect"

const CustomIndicatorsContainerWithCopy = ({
  children,
  value,
  ...rest
}: {
  value: StyledSelectProps["value"]
  pathToCopy: string
} & IndicatorsContainerProps<unknown, boolean, GroupBase<unknown>>) => {
  const successIconColor = useColorModeValue("green.800", "green.200")

  /* We are not using the useClipboard hook, because its onCopy function triggers
  a re-render, hiding the checkmark feedback on successful copy. */
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(parseFromObject(value, "value"))
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <components.IndicatorsContainer {...rest}>
      {value && (
        <IconButton
          backgroundColor={isCopied && transparentize(successIconColor, 0.12)(theme)}
          color={isCopied && successIconColor}
          icon={isCopied ? <Check /> : <Copy />}
          aria-label={"Copy"}
          size={"xs"}
          rounded={"full"}
          variant={"ghost"}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleCopy()
          }}
          onTouchEnd={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleCopy()
          }}
        />
      )}
      {children}
    </components.IndicatorsContainer>
  )
}

export default CustomIndicatorsContainerWithCopy
