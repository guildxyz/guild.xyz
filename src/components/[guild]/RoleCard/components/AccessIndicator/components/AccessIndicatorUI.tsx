import {
  ChakraProps,
  Spinner,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  useBreakpointValue,
} from "@chakra-ui/react"

type Props = {
  isLoading?: boolean
  colorScheme: string
  icon?: any // TODO: proper type
  label: string
}

const STYLES: ChakraProps = {
  flexShrink: 0,
  borderRadius: "lg",
  position: { base: "absolute", md: "relative" },
  left: 0,
  bottom: 0,
  width: { base: "full", md: "auto" },
  borderTopRadius: { base: 0, md: "lg" },
  justifyContent: { base: "space-between", md: "start" },
  px: { base: 5, md: 3 },
  py: { base: 2, md: 0 },
  ml: { base: "0 !important", md: "unset !important" },
}

const AccessIndicatorUI = ({
  isLoading,
  colorScheme,
  icon,
  label,
}: Props): JSX.Element => {
  const IconComponent = useBreakpointValue({ base: TagRightIcon, md: TagLeftIcon })

  return (
    <Tag title={label} size="lg" colorScheme={colorScheme} {...STYLES}>
      <TagLabel fontSize="sm" order={{ md: 1 }}>
        {label}
      </TagLabel>

      <IconComponent as={isLoading ? Spinner : icon} boxSize={3} />
    </Tag>
  )
}

export default AccessIndicatorUI
export { STYLES as ACCESS_INDICATOR_STYLES }
