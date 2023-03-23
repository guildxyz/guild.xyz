import {
  ChakraProps,
  Spinner,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Rest } from "types"

type Props = {
  isLoading?: boolean
  colorScheme: string
  icon?: any // TODO: proper type
  label: string
} & Rest

const ACCESS_INDICATOR_STYLES: ChakraProps = {
  flexShrink: 0,
  borderRadius: "lg",
  borderTopRadius: { base: 0, md: "lg" },
  px: { base: 5, md: 3 },
  py: { base: 2, md: 0 },
  justifyContent: { base: "space-between", md: "start" },
  // width: { base: "full", md: "auto" },
  // ml: { base: "0 !important", md: "unset !important" },
}
// const ACCESS_INDICATOR_LAYOUT_STYLES: ChakraProps = {
//   position: { base: "absolute", md: "relative" },
//   left: 0,
//   bottom: 0,
//   width: { base: "full", md: "auto" },
//   justifyContent: { base: "space-between", md: "start" },
//   ml: { base: "0 !important", md: "unset !important" },
// }

const AccessIndicatorUI = ({
  isLoading,
  colorScheme,
  icon,
  label,
  ...rest
}: Props): JSX.Element => {
  const IconComponent = useBreakpointValue({ base: TagRightIcon, md: TagLeftIcon })

  return (
    <Tag
      title={label}
      size="lg"
      colorScheme={colorScheme}
      {...ACCESS_INDICATOR_STYLES}
      // {...ACCESS_INDICATOR_LAYOUT_STYLES}
      {...rest}
    >
      <TagLabel fontSize="sm" order={{ md: 1 }}>
        {label}
      </TagLabel>

      <IconComponent as={isLoading ? Spinner : icon} boxSize={3} />
    </Tag>
  )
}

export default AccessIndicatorUI
export { ACCESS_INDICATOR_STYLES }
