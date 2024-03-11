import { IconButton, theme, useClipboard, useColorModeValue } from "@chakra-ui/react"
import { transparentize } from "@chakra-ui/theme-tools"
import { GroupBase, IndicatorsContainerProps, components } from "chakra-react-select"
import { Check, Copy } from "phosphor-react"
import parseFromObject from "utils/parseFromObject"
import { StyledSelectProps } from "../StyledSelect"

const CustomIndicatorsContainer = ({
  children,
  value,
  ...rest
}: {
  value: StyledSelectProps["value"]
  pathToCopy: string
} & IndicatorsContainerProps<unknown, boolean, GroupBase<unknown>>) => {
  const successIconColor = useColorModeValue("green.800", "green.200")

  const { onCopy, hasCopied } = useClipboard(parseFromObject(value, "value"), 1000)

  return (
    <components.IndicatorsContainer {...rest}>
      {value && (
        <IconButton
          backgroundColor={
            hasCopied && transparentize(successIconColor, 0.12)(theme)
          }
          color={hasCopied && successIconColor}
          icon={hasCopied ? <Check /> : <Copy />}
          aria-label={"Copy"}
          size={"xs"}
          rounded={"full"}
          variant={"ghost"}
          onMouseDown={() => {
            onCopy()
          }}
        />
      )}
      {children}
    </components.IndicatorsContainer>
  )
}

export default CustomIndicatorsContainer
