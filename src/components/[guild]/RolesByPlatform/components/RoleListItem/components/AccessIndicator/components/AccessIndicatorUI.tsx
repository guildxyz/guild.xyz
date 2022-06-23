import {
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

const AccessIndicatorUI = ({
  isLoading,
  colorScheme,
  icon,
  label,
}: Props): JSX.Element => {
  const showLeftIcon = useBreakpointValue({ base: false, md: true })
  const showRightIcon = useBreakpointValue({ base: true, md: false })

  return (
    <Tag
      size="lg"
      colorScheme={colorScheme}
      borderRadius="lg"
      position={{ base: "absolute", md: "relative" }}
      left={0}
      bottom={0}
      width={{ base: "full", md: "auto" }}
      borderTopRadius={{ base: 0, md: "lg" }}
      justifyContent={{ base: "space-between", md: "start" }}
    >
      {showLeftIcon && (
        <>
          {isLoading ? (
            <Spinner boxSize={3} color="gray" mr={2} />
          ) : icon ? (
            <TagLeftIcon as={icon} boxSize={3} />
          ) : null}
        </>
      )}

      <TagLabel fontSize="sm">{label}</TagLabel>

      {showRightIcon && (
        <>
          {isLoading ? (
            <Spinner boxSize={3} color="gray" mr={2} />
          ) : icon ? (
            <TagRightIcon as={icon} boxSize={3} />
          ) : null}
        </>
      )}
    </Tag>
  )
}

export default AccessIndicatorUI
