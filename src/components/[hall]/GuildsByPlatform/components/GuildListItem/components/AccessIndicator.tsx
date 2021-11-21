import { Flex, Icon, Stack, Text, useColorMode } from "@chakra-ui/react"

type Props = {
  icon: React.FC
  label: string
  colorScheme?: string
}

const AccessIndicator = ({
  icon,
  label,
  colorScheme = "gray",
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Stack
      direction={{ base: "row", md: "column" }}
      alignItems="center"
      justifyContent="start"
      position="relative"
      p={4}
      minWidth="max-content"
      height="max-content"
      _before={{
        content: "''",
        position: "absolute",
        inset: 0,
        rounded: "xl",
        bgColor: `${colorScheme}.${colorMode === "light" ? "200" : "500"}`,
        opacity: 0.15,
      }}
    >
      <Flex
        boxSize={6}
        alignItems="center"
        justifyContent="center"
        bgColor={`${colorScheme}.${colorMode === "light" ? "200" : "500"}`}
        rounded="full"
      >
        <Icon boxSize={4} as={icon} />
      </Flex>
      <Text
        color={`${colorScheme}.${colorMode === "light" ? "200" : "500"}`}
        fontSize="sm"
      >
        {label}
      </Text>
    </Stack>
  )
}

export default AccessIndicator
