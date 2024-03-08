import { IconButton } from "@chakra-ui/react"
import { GroupBase, IndicatorsContainerProps, components } from "chakra-react-select"
import { Copy } from "phosphor-react"
import parseFromObject from "utils/parseFromObject"
import { StyledSelectProps } from "../StyledSelect"

const CustomIndicatorsContainer = ({
  children,
  value,
  pathToCopy,
  ...rest
}: {
  value: StyledSelectProps["value"]
  pathToCopy: string
} & IndicatorsContainerProps<unknown, boolean, GroupBase<unknown>>) => {
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(parseFromObject(value, pathToCopy))
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <components.IndicatorsContainer {...rest}>
      <IconButton
        icon={<Copy />}
        aria-label={"Copy"}
        size={"xs"}
        rounded={"full"}
        variant={"ghost"}
        onMouseDown={() => {
          handleCopyToClipboard()
        }}
      />
      {children}
    </components.IndicatorsContainer>
  )
}

export default CustomIndicatorsContainer
