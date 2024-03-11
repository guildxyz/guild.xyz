import { IconButton, useColorModeValue } from "@chakra-ui/react"
import { transparentize } from "@chakra-ui/theme-tools"
import { GroupBase, IndicatorsContainerProps, components } from "chakra-react-select"
import { motion } from "framer-motion"
import { Check, Copy } from "phosphor-react"
import { useState } from "react"
import parseFromObject from "utils/parseFromObject"
import { StyledSelectProps } from "../StyledSelect"

const MotionIconButton = motion(IconButton)

const CustomIndicatorsContainer = ({
  children,
  value,
  ...rest
}: {
  value: StyledSelectProps["value"]
  pathToCopy: string
} & IndicatorsContainerProps<unknown, boolean, GroupBase<unknown>>) => {
  const [copied, setCopied] = useState(false)
  const successIconColor = useColorModeValue("green.800", "green.200")

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(parseFromObject(value, "value"))
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 1000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <components.IndicatorsContainer {...rest}>
      {value && (
        <MotionIconButton
          bg={copied && transparentize(successIconColor, 0.12)}
          color={copied && successIconColor}
          icon={copied ? <Check /> : <Copy />}
          aria-label={"Copy"}
          size={"xs"}
          rounded={"full"}
          variant={"ghost"}
          onMouseDown={() => {
            handleCopyToClipboard()
          }}
        />
      )}
      {children}
    </components.IndicatorsContainer>
  )
}

export default CustomIndicatorsContainer
