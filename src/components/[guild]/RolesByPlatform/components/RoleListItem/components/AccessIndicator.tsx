import { Center, Icon, Stack, Text, useColorModeValue } from "@chakra-ui/react"
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
  const swatch = useColorModeValue(colorScheme === "green" ? "500" : "200", "500")

  return (
    <Stack
      direction={{ base: "row", md: "column" }}
      alignItems="center"
      w="36"
      pt="2"
    >
      <Center
        boxSize={5}
        bgColor={`${colorScheme}.${swatch}`}
        color={colorScheme === "green" ? "white" : undefined}
        rounded="full"
      >
        <Icon boxSize={3} as={icon} />
      </Center>
      <Text colorScheme="gray" fontSize="sm">
        {label}
      </Text>
    </Stack>
  )
}

export default AccessIndicator
