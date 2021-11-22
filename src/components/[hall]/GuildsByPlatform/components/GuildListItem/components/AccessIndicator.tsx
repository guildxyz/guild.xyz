import { Center, Icon, Stack, Text, useColorMode } from "@chakra-ui/react"
import { FunctionComponent } from "react"

type Props = {
  icon: FunctionComponent
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
      w="36"
      justifyContent={{ md: "center" }}
    >
      <Center
        boxSize={5}
        bgColor={`${colorScheme}.${colorMode === "light" ? "200" : "500"}`}
        rounded="full"
      >
        <Icon boxSize={3} as={icon} />
      </Center>
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
